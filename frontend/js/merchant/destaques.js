import { products } from "../mocks/produtos_db.js"
import { filterProducts } from "../components/searchProduto.js"


export function initDestaques() {
  const containerPrincipal = document.querySelector(".product-list-all");
  const containerSelected = document.querySelector(".selected-products");

  const selectedProductsState = []; //Substituir por banco de dados

  renderProdutos(products, containerPrincipal, selectedProductsState);
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
        alert("Salve os produtos antes de sair.");
        return; 
      }
      history.back();
    });
  }
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
            ${selectedState.some((item) => item.id === product.id) ? "checked" : ""}
          >
          <img class="product-image-all" src="${product.image}">
          <h2>${product.name}</h2>
          <span class="metrics-product-all">
            <p class="rate">${product.rate}</p>
            <p class="views">${product.view} pessoas já viram</p>
          </span>
          <div class="product-footer-all">
            <div class="price-group-all">
              <span class="promocional-price">R$ ${product.promocionalPrice}</span>
              <span class="normal-price-all">R$ ${product.normalPrice}</span>
            </div>
            <button type="button">Ver</button>
          </div>
        </a>
      `
    )
    .join("");
}

function searchProductList(container, selectedProductsState, containerSelected) {
  const buttonSearch = document.querySelector(".buttonSearch");

  buttonSearch?.addEventListener("click", () => {
    const queryProduct = document.querySelector(".searchProduct").value;
    const productFiltered = filterProducts(queryProduct, products);

    renderProdutos(productFiltered, container, selectedProductsState);
    renderSelectedProducts(selectedProductsState, containerSelected);
  });
}

function bindSelection(containerPrincipal, containerSelected, selectedProductsState) { //vinculação
  const handleSelection = (event) => { //tratamento
    if (!event.target.classList.contains("selectProduct")) return;

    const card = event.target.closest("[data-id]");
    const id = card?.dataset.id;
    if (!id) return;

    const product = products.find((item) => item.id === id);
    if (!product) return;

    const alreadySelectedIndex = selectedProductsState.findIndex(
      (item) => item.id === id
    );

    if (event.target.checked) {
      if (alreadySelectedIndex === -1) {
        selectedProductsState.push(product);
      }
    } else {
      if (alreadySelectedIndex !== -1) {
        selectedProductsState.splice(alreadySelectedIndex, 1);
      }
    }

    renderProdutos(products, containerPrincipal, selectedProductsState);
    renderSelectedProducts(selectedProductsState, containerSelected);
  };

  containerPrincipal?.addEventListener("change", handleSelection);
  containerSelected?.addEventListener("change", handleSelection);
}


function renderSelectedProducts(selectedState, container) {
  if (!container) return;

  container.innerHTML = selectedState
    .map(
      (product) => `
      
        <a class="product-card-selected" data-id="${product.id}" href="../merchant/produto.html?id=${product.id}">
          <input type="checkbox" class="selectProduct" checked>
          <p class="selectText">Selecionado</p>
          <img src="${product.image}">
          <h2>${product.name}</h2>
          <span class="metrics-product-all">
            <p class="rate">${product.rate}</p>
            <p class="views">${product.view} pessoas já viram</p>
          </span>
            <div class="price-group-selected">
              <span class="promocional-price">R$ ${product.promocionalPrice}</span>
              <span class="normal-price-all">R$ ${product.normalPrice}</span>
            </div>
        </a>
      `
    )
    .join("");
}