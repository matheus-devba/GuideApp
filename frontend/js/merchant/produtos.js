import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'

export function initProdutos() {
  renderProdutos();

  const menuItem = document.querySelector('.menu-item.produtos');
  if (menuItem) {
    menuItem.classList.add('selected-item');
  }
}

async function renderProdutos () {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/produtos/ativosAll`);
  const products = await response.json();

  container.innerHTML = products
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

        return `
            <a class="product-card-all" href="${API_BASE_URL}/produtos/${product.id}">
                <img class="product-image-all" src="${product.image}">
                <div class="product-info-all">
                <h2>${product.nome}</h2>
                <span class="metrics-product-all">
                    <p class="views">${product.views}</p>
                </span>
                <div class="product-footer-all">
                    <div class="price-group-all">
                      <!-- O formatMoney já adiciona o "R$" automaticamente -->
                      <span class="promocional-price">${formatMoney(precoExibido)}</span>
                      <span class="normal-price-all">${temPromocao ? formatMoney(product.preco_normal) : ""}</span>
                    </div>
                    <button type="button">Ver</button>
                </div>
                </div>
            </a>
        `;
      }
    )
    .join("");
}
