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
            <a class="product-card-all" href="../merchant/produto.html?id=${product.id}">
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
      `
    )
    .join("");
}