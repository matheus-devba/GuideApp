import { destaques } from "../mocks/destaques_db.js"

export function initDestaques() {
  renderDestaque();
}

function renderDestaque () {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  container.innerHTML = destaques[0].products
    .map(
      (product) => `
              <a class="product-card-all" href="../consumer/produto.html?id=${product.id}">
                <img class="product-image-all" src="${product.image}">
                <div class="product-info-all">
                  <h2>${product.name}</h2>
                  <span class="metrics-product-all">
                      <p class="rate">${product.rate}</p>
                      <p class="views">${product.view}</p>
                  </span>
                  <div class="product-footer-all">
                      <div class="price-group-all">
                        <span class="promocional-price">R$ ${product.promocionalPrice} </span>
                        <span class="normal-price-all">R$ ${product.normalPrice}</span>
                      </div>
                      <button type="button">Ver</button>
                  </div>
                </div>
            </a>
      `
    )
    .join("");
}