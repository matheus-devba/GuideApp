import { API_BASE_URL } from "../api/config.js";
import {getListaID, renderProdutos, searchProductList, bindSelection, renderSelectedProducts} from "./formLista.shared.js"
import { filterProducts } from "../components/searchProduto.js"
import { verificacaoUsuario } from "../services/requisicoesMerchant.js";



export async function initFormListaUpdate() {
  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  const containerPrincipal = document.querySelector(".product-list-all");
  const containerSelected = document.querySelector(".selected-products");
  const idLista = getListaID()

  if (!idLista) return

  const responseLista = await fetch(`${API_BASE_URL}/api/lista-produtos/lista/${idLista}`)
  const produtosDaLista = await responseLista.json()

  const selectedProductsState = produtosDaLista ?? [];

  const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/ativosAll`)
  const produtosAtivos = await responseProdutos.json()

  const responseNomeLista = await fetch(`${API_BASE_URL}/api/listas/merchant/${idLista}`)
  const nomeLista = await responseNomeLista.json()

  const fieldNomeLista = document.getElementById('list-name')

  if (fieldNomeLista && nomeLista && nomeLista) {
    fieldNomeLista.value = nomeLista.nome
    }

  renderProdutos(produtosAtivos, containerPrincipal, selectedProductsState);
  renderSelectedProducts(selectedProductsState, containerSelected);

  searchProductList(containerPrincipal, selectedProductsState, containerSelected);

  bindSelection(
    containerPrincipal,
    containerSelected,
    selectedProductsState
  );

// Solução para não sair antes de salvar a lista
  const iconBack = document.getElementById('back');
  const containerProducts = document.querySelector('.selected-products');

  if (iconBack) {
    iconBack.addEventListener("click", () => {
      const hasProdutsSelected = containerProducts ? containerProducts.children.length > 0 : false;

      if (hasProdutsSelected) {
        alert("Salve a lista antes de sair.");
        return; 
      }
      history.back();
    });
  }

  const form = document.querySelector('.newList-form')  
  form.addEventListener("submit", (handleSubmitEdit)); //envia os produtos

};





async function handleSubmitEdit(event) {
  // Evita recarregar a página
  event.preventDefault();

  // Pega o ID da lista pela URL
  const lista_id = Number(getListaID());

  if (!lista_id) {
    alert("ID da lista não encontrado.");
    return;
  }

  // Pega o nome digitado no formulário
  const nome = (document.querySelector("#list-name")?.value || "").trim();

  // Pega apenas os produtos marcados
  const produtos = Array.from(
    document.querySelectorAll(".product-card-all .selectProduct:checked")
  )
    .map((checkbox) => Number(checkbox.closest(".product-card-all")?.dataset?.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  try {
    // Primeiro salva o nome (rota de listas)
    if (nome.length > 0) {
      const rNome = await fetch(`${API_BASE_URL}/api/listas/merchant/update/${lista_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });

      if (!rNome.ok) {
        const erroNome = await rNome.json().catch(() => ({}));
        throw new Error(`HTTP ${rNome.status} - ${erroNome.message || "Erro ao atualizar nome"}`);
      }
    }

    // Depois salva os produtos da lista (rota de lista_produto)
    const rProdutos = await fetch(`${API_BASE_URL}/api/lista-produtos/update/${lista_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lista_id, produtos }),
    });

    if (!rProdutos.ok) {
      const erroProdutos = await rProdutos.json().catch(() => ({}));
      throw new Error(`HTTP ${rProdutos.status} - ${erroProdutos.message || "Erro ao atualizar produtos"}`);
    }

    alert("Lista atualizada com sucesso!");
    window.location.href = `/listas/merchant/${lista_id}`;
  } catch (error) {
    console.error("Erro ao atualizar lista:", error);
    alert("Não foi possível atualizar a lista.");
  }
}