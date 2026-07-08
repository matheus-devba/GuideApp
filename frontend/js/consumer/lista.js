import { lists } from "../mocks/listas_db.js"

export function initLista() {
  const params = new URLSearchParams(window.location.search);
  const listId = params.get("id");

  renderLista(listId);
}



function renderLista (listId) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const list = lists.find((item) => item.id === listId);
  if (!list) return;

  const titleList = document.querySelector(".sections-title")
  titleList.innerHTML = list.title


  container.innerHTML = list.products
    .map((product) => `
            <a class="product-card-all" href="../consumer/produto.html?id=${product.id}">
                <input type="checkbox">
                <img class="product-image-all" src="${product.image}">
                <h2>${product.name}</h2>
                <span class="metrics-product-all">
                    <p class="rate">${product.rate}</p>
                    <p class="views">${product.view} pessoas já viram</p>
                </span>
                <div class="product-footer-all">
                    <div class="price-group-all">
                      <span class="promocional-price">R$ ${product.promocionalPrice} </span>
                      <span class="normal-price-all">R$ ${product.normalPrice}</span>
                    </div>
                    <button type="button">Ver</button>
                </div>
            </a>
      `)
    .join("");
}
