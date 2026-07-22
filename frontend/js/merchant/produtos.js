import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'

export function initProdutos() {
  renderProdutos("ativosAll"); //resolver render e hidden

  const sectionActions = document.querySelector('.actions')
  sectionActions.innerHTML = `
    <a class="new-product-btn" href="${API_BASE_URL}/produtos/new">Novo Produto +</a>
    <a class="hidden-product-btn" href="#">Produtos Ocultos</a>
  `

  const btnHidden = document.querySelector('.hidden-product-btn')

  btnHidden.addEventListener('click', async() => {
    renderProdutos("hidden")
  })

  const menuItem = document.querySelector('.menu-item.produtos');
  if (menuItem) {
    menuItem.classList.add('selected-item');
  }
}


async function renderProdutos (filter) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/produtos/${filter}`);
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
                <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
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

