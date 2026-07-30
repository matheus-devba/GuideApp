import { API_BASE_URL } from "../api/config.js";
import {
  buildProdutoPayload,
  fetchProduto,
  fetchProdutoImagens,
  getProdutoIdFromPath,
  loadCategorias,
  setupImageGallery,
  uploadProdutoImagens,
} from "./formProduto.shared.js";
import { verificarUser, insertNomeDaLoja, getLojaId, verificacaoUsuario } from "../services/requisicoesMerchant.js";
import { popupMessage, popupConfirm } from "../components/popup.js";


let gallery = null;
let imagensIniciaisUrls = []; // Guardará as URLs originais da loja


/**
 * Inicializa a tela de edição de produto.
 * Aqui a lógica é:
 * - pega o id na URL
 * - busca o produto no backend
 * - preenche os campos
 * - carrega categorias
 * - carrega imagens já salvas
 * - faz o submit para atualizar
 */
export async function initEditProduto() {
  const form = document.querySelector("#product-form");
  if (!form) return;

  const produtoId = getProdutoIdFromPath();
  if (!produtoId) return;

  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  const produto = await fetchProduto(produtoId);

  if (!produto) {
    popupMessage({
      titulo: "Erro!",
      mensagem: "Produto não encontrado."
    })
    return;
  }

  preencherCampos(produto);
  await loadCategorias(produto.categoria_id);

 const imagens = await fetchProdutoImagens(produtoId);
  
  // Salva as URLs iniciais vindas do banco
  imagensIniciaisUrls = imagens.map((img) => img.url);
  gallery = setupImageGallery({
    containerSelector: ".list-grid",
    initialItems: [...imagensIniciaisUrls],
    maxFiles: 5,
  });
  if (!form.dataset.submitBound) {
    form.dataset.submitBound = "true";
    form.addEventListener("submit", (event) => handleEditSubmit(event, produtoId));
  }
}

/**
 * Preenche os inputs do formulário com os dados do produto.
 */
function preencherCampos(produto) {
  const nameInput = document.querySelector("#product-name");
  const descriptionInput = document.querySelector("#product-description");
  const normalPriceInput = document.querySelector("#product-price-normal");
  const promocionalPriceInput = document.querySelector("#product-price-promocional");
  const destaqueOption = document.querySelector("#destaqueOption");
  const categoriaSelect = document.querySelector("#categoria");

  if (nameInput) nameInput.value = produto.nome ?? "";
  if (descriptionInput) descriptionInput.value = produto.descricao ?? "";
  if (normalPriceInput) normalPriceInput.value = produto.preco_normal ?? "";
  if (promocionalPriceInput) {
    promocionalPriceInput.value = produto.preco_promocional ?? "";
  }

  if (destaqueOption) {
    destaqueOption.value = String(produto.destaque);
  }

  if (categoriaSelect) {
    categoriaSelect.value = String(produto.categoria_id ?? "");
  }
}

/**
 * Trata o submit no modo edição.
 * Primeiro atualiza o produto.
 * Depois envia apenas as imagens novas.
 */
async function handleEditSubmit(event, produtoId) {
  event.preventDefault();
  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const payload = await buildProdutoPayload();
    // 1. Atualiza dados do produto (nome, preço, etc.)
    const response = await fetch(`${API_BASE_URL}/api/produtos/update/${produtoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const produtoAtualizado = await response.json();
    // 2. Pega todos os itens atuais que estão visíveis na galeria
    const itensAtuais = gallery?.getItems?.() || [];
    // 3. Descobre quais URLs foram removidas pelo usuário
    const urlsRemovidas = imagensIniciaisUrls.filter(url => !itensAtuais.includes(url));
    // 4. Deleta do banco cada imagem antiga que foi removida da tela
    for (const url of urlsRemovidas) {
      await fetch(`${API_BASE_URL}/api/produto_imagens/delete/${produtoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    }
    // 5. Envia as fotos NOVAS adicionadas (arquivos do tipo File)
    await uploadProdutoImagens(produtoId, itensAtuais);
    popupMessage({
      titulo: "Sucesso!",
      mensagem: "Produto e imagens atualizados com sucesso!"
    })
    await delay(2000)
    window.location.href = `/merchant/produtos.html`;
  } catch (error) {
    popupMessage({
      titulo: "Erro!",
      mensagem: "Erro ao atualizar produto. Tente novamente."
    })
    console.error("Erro ao atualizar produto:", error);
  }
}