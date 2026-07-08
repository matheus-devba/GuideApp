
import { lists } from "../mocks/listas_db.js"
import { destaques } from "../mocks/destaques_db.js"
import { products } from "../mocks/produtos_db.js";
import { categorias } from "../mocks/categorias_db.js";


export function initLoja() {
  renderLists();
  renderDestaque()
  renderProdutos()
  renderCategoria()
}




function createListCard(list) {
 return `
        <a class="list-product-card" href="../consumer/lista.html?id=${list.id}">
          <div class="list-card-images">
            <img src="${list.imageBack}" class="list-image back">
            <img src="${list.imageFront}" class="list-image front">
            <span class="badge">${list.badge}</span>
          </div>
          <div class="list-content">
            <h4>${list.title}</h4>
            <p>${list.count}</p>
          </div>
        </a>
      `
}

function createCard(product) {
  return `
        <a class="product-card" href="../consumer/produto.html?id=${product.id}">
            <img class="product-image" src="${product.image}">
            <h2>${product.name}</h2>
            <span class="metrics-product">
                <p class="rate">${product.rate}</p>
                <p class="views">${product.view} pessoas já viram</p>
            </span>
            <div class="product-footer">
                <div class="price-group">
                      <span class="promocional-price">R$ ${product.promocionalPrice} </span>
                      <span class="normal-price-all">R$ ${product.normalPrice}</span>
                </div>
                <button type="button">Ver</button>
            </div>
        </a>
      `
}

function createListCategory(list) {
  return `
    <a class="circle-category" href="../consumer/categoria.html?id=${list.id}">
        <img src=${list.image} class="category-image">
        <h4>${list.name} </h4>
    </a>
  `
}

function renderLists () {
  const container = document.querySelector(".list-grid");
  if (!container) return;

  container.innerHTML = lists.map((list) => createListCard(list)).join('')

}

function renderDestaque() {
  const container = document.querySelector(".product-grid");
  if (!container) return;

  container.innerHTML = destaques[0].products.map((product) => createCard(product)).join("")
}


function renderProdutos() {
  const container = document.querySelector(".products-grid");
  if (!container) return;

  container.innerHTML = products.map((product) => createCard(product)).join("")
}

function renderCategoria() {
  const container = document.querySelector(".list-category");
  if (!container) return;

  container.innerHTML = categorias.map((list) => createListCategory(list)).join('')
}
