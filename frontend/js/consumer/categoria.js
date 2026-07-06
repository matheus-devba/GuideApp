import { categorias } from "../mocks/categorias_db.js"

export function initCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("id");
  const itemQuery = params.get("query");

  renderCategoria(categoryId);
  
}


function renderCategoria (categoryId) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const categoryList = categorias.find((item) => item.id === categoryId);
  if (!categoryList) return;

  const fieldHeader = document.querySelector(".circle-category")
  fieldHeader.innerHTML = `                
    <img src=${categoryList.image} class="category-image">
    <h4>${categoryList.name} </h4>`


  container.innerHTML = categoryList.products
    .map(
      (product) => `
            <a class="product-card-all" href="../consumer/produto.html?id=${product.id}">
                <img class="product-image-all" src="${product.image}">
                <h2>${product.name}</h2>
                <span class="metrics-product-all">
                    <p class="rate">${product.rate}</p>
                    <p class="views">${product.view}</p>
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
