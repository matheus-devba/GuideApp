import { products } from "../mocks/produtos_db.js"

export function initProdutos() {
  renderProdutos();
}

function renderProdutos () {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
            <a class="product-card-all" href="../consumer/produto.html?id=${product.id}">
                <img class="product-image-all" src="${product.image}">
                <h2>${product.name}</h2>
                <span class="metrics-product-all">
                    <p class="rate">${product.rate}</p>
                    <p class="views">${product.view} pessoas já viram</p>
                </span>
                <div class="product-footer-all">
                    <div class="price-group-all">
                        <span class="past-price">${product.pastPrice}</span>
                        <span class="current-price">${product.currentPrice}</span>
                    </div>
                    <button type="button">Ver</button>
                </div>
            </a>
      `
    )
    .join("");
}