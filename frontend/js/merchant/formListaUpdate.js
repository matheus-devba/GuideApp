import { API_BASE_URL } from "../api/config.js";
import {getListaID} from "./formLista.shared.js"
import { filterProducts } from "../components/searchProduto.js"



export async function initFormListaUpdate() {
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
  form.addEventListener("submit", (handleCreateSubmit));

};


function renderProdutos(productsList, container, selectedState) {
  if (!container) return;

  container.innerHTML = productsList
    .map(
      (product) => `
        <a class="product-card-all" data-id="${product.id}" href="../merchant/produto.html?id=${product.id}">
          <input 
            type="checkbox" 
            class="selectProduct"
            ${selectedState.some((item) => String(item.produto_id || item.id) === String(product.id)) ?  "checked" : ""}
          >
          <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
          <div class="product-info-all">
            <h2>${product.nome}</h2>
            <span class="metrics-product-all">
                <p class="views">${product.views} pessoas já viram</p>
            </span>
            <div class="product-footer-all">
                <div class="price-group-all">
                <span class="promocional-price">R$ ${product.preco_promocional}</span>
                <span class="normal-price-all">R$ ${product.preco_normal}</span>
                </div>
                <button type="button">Ver</button>
            </div>
          </div>  
        </a>
      `
    )
    .join("");
}

function searchProductList(container, selectedProductsState, containerSelected) {
  const buttonSearch = document.querySelector(".buttonSearch");

  buttonSearch?.addEventListener("click", async () => {
    const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/ativosAll`)
    const produtosAtivos = await responseProdutos.json()

    const queryProduct = document.querySelector(".searchProduct").value;
    const productFiltered = filterProducts(queryProduct, produtosAtivos);

    renderProdutos(productFiltered, container, selectedProductsState);
    renderSelectedProducts(selectedProductsState, containerSelected);
  });
}

function bindSelection(containerPrincipal, containerSelected, selectedProductsState) { //vinculação
  const handleSelection = async (event) => { //tratamento
    if (!event.target.classList.contains("selectProduct")) return;

    const card = event.target.closest("[data-id]");
    const id = card?.dataset.id;
    if (!id) return;

    const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/ativosAll`)
    const produtosAtivos = await responseProdutos.json()

    // CORREÇÃO: Comparação convertendo para String
    const product = produtosAtivos.find((item) => String(item.id) === String(id));
    if (!product) return;

    // CORREÇÃO: Varre checando ambas as chaves possíveis em formato String
    const alreadySelectedIndex = selectedProductsState.findIndex(
      (item) => String(item.produto_id || item.id) === String(id)
    );

    if (event.target.checked) {
      if (alreadySelectedIndex === -1) {
        // CORREÇÃO: Salva mapeado como produto_id para manter consistência com o banco
        selectedProductsState.push({ ...product, produto_id: product.id });
      }
    } else {
      if (alreadySelectedIndex !== -1) {
        selectedProductsState.splice(alreadySelectedIndex, 1);
      }
    }

    renderProdutos(produtosAtivos, containerPrincipal, selectedProductsState);
    renderSelectedProducts(selectedProductsState, containerSelected);
  };

  containerPrincipal?.addEventListener("change", handleSelection);
  containerSelected?.addEventListener("change", handleSelection);
}


async function renderSelectedProducts(selectedState, container) {
  if (!container) return;

  const html = await Promise.all(
    selectedState.map(async (product) => {
      // 1. CORREÇÃO DE SEGURANÇA: Usa product.produto_id se o estado vier da tabela de ligação
      const produtoId = product.produto_id || product.id;
      
      const responseProdutos = await fetch(
        `${API_BASE_URL}/api/produtos/${produtoId}`
      );
      const produtos = await responseProdutos.json();

      if (!produtos) return ""; // Evita renderizar cards vazios caso o produto seja deletado

      return `
        <a class="product-card-selected" data-id="${produtos.id}" href="../merchant/produto.html?id=${produtos.id}">
          <input type="checkbox" class="selectProduct" checked>
          <p class="selectText">Selecionado</p>
          <img src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtos.id}">
          <h2>${produtos.nome}</h2>
            <div class="price-group-selected">
              <span class="promocional-price">R$ ${produtos.preco_promocional}</span>
              <span class="normal-price-all">R$ ${produtos.preco_normal}</span>
            </div>
        </a>
      `;
    })
  );

  // CORREÇÃO: Transforma a array de strings em uma string única sem vírgulas
  container.innerHTML = html.join("");
}
