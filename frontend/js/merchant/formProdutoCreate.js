import { API_BASE_URL } from "../api/config.js";
import { verificarUser, insertNomeDaLoja, getLojaId, verificacaoUsuario } from "../services/requisicoesMerchant.js";

import {
  buildProdutoPayload,
  loadCategorias,
  setupImageGallery,
  uploadProdutoImagens
} from "./formProduto.shared.js";
import { popupMessage, popupConfirm } from "../components/popup.js";



let gallery = null;

/**
 * Inicializa a tela de criação de produto.
 * Aqui a lógica é:
 * - carrega categorias
 * - inicializa a galeria vazia
 * - escuta o submit do formulário
 */
export async function initCreateProduto() {
  const form = document.querySelector("#product-form");
  if (!form) return;

  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  // Carrega o select de categorias
  await loadCategorias();


  // Galeria começa vazia no modo criação
  gallery = setupImageGallery({
    containerSelector: ".list-grid",
    initialItems: [],
    maxFiles: 5,
  });

  // Evita duplicar o listener caso o init rode mais de uma vez
  if (!form.dataset.submitBound) {
    form.dataset.submitBound = "true";
    form.addEventListener("submit", handleCreateSubmit);
  }
}

/**
 * Trata o submit no modo criação.
 * Primeiro cria o produto.
 * Depois envia as imagens novas para a tabela intermediária.
 */
async function handleCreateSubmit(event) {
  event.preventDefault();

  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const payload = await buildProdutoPayload();
    console.log(payload)

    if (!payload.nome || !payload.categoria_id || Number.isNaN(payload.preco_normal)) {
      popupMessage({
      titulo: "Opa!",
      mensagem: "Preencha os campos obrigatórios."
      })
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/produtos/merchant/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const produto = await response.json();

    // Depois que o produto existe, sobe as imagens do carrossel
    await uploadProdutoImagens(produto.id, gallery?.getItems?.() || []);

    popupMessage({
      titulo: "Sucesso!",
      mensagem: "Produto criado com sucesso!"
      })
      await delay(2000)
    window.location.href = `/merchant/produtos.html`;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }
}