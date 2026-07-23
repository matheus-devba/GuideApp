import { API_BASE_URL } from "../api/config.js";
import {
  buildProdutoPayload,
  fetchProduto,
  fetchProdutoImagens,
  getProdutoIdFromPath,
  loadCategorias,
  setupImageGallery,
  uploadProdutoImagens,
  DEFAULT_LOJA_ID,
} from "./formProduto.shared.js";

let gallery = null;

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

  const produto = await fetchProduto(produtoId);

  if (!produto) {
    alert("Produto não encontrado.");
    return;
  }

  preencherCampos(produto);
  await loadCategorias(produto.categoria_id);

  const imagens = await fetchProdutoImagens(produtoId);

  // No modo edição, a galeria começa com as imagens já cadastradas
  gallery = setupImageGallery({
    containerSelector: ".list-grid",
    initialItems: imagens.map((img) => img.url),
    maxFiles: 5,
  });

  // Evita duplicar submit
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
    const payload = buildProdutoPayload(DEFAULT_LOJA_ID);

    const response = await fetch(`${API_BASE_URL}/api/produtos/update/${produtoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const produtoAtualizado = await response.json();

    // Se o usuário adicionou novas imagens, elas entram aqui
    await uploadProdutoImagens(produtoId, gallery?.getItems?.() || []); //referência ao multer

    alert("Produto atualizado com sucesso!");
    window.location.href = `/produtos/${produtoAtualizado.id || produtoId}`;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
  }
}