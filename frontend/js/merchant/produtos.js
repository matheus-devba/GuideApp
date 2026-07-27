import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'
import { verificarUser, getLojaId, insertNomeDaLoja } from "../services/requisicoesMerchant.js";


export async function initProdutos() {
 // 1. Executa a verificação inicial do usuário logado
  const user = await verificarUser();
  // Se não estiver logado, a função acima redireciona para o login e nós encerramos a execução aqui
  if (!user) return; 

  const lojaId = await getLojaId()

  await insertNomeDaLoja(lojaId.id)
  renderProdutos("ativos", lojaId.id); //resolver render e hidden

  const sectionActions = document.querySelector('.btn-actions')
  sectionActions.innerHTML = `
    <a class="new" href="${API_BASE_URL}/produtos/merchant/new">Criar Produto</a>

  `
  const sectionFilter = document.querySelector('.filter')
  sectionFilter.innerHTML = `
            <a class="all" href="#">Todos</a>
            <a class="hidden" href="#">Ocultos</a>
            <a class="destaque" href="#">Destacados</a>

  `

  const btnAll = document.querySelector('.all')

  btnAll.addEventListener('click', async() => {
    renderProdutos("ativos", lojaId.id)
  })
  const btnHidden = document.querySelector('.hidden')

  btnHidden.addEventListener('click', async() => {
    renderProdutos("ocultos", lojaId.id)
  })

  const btnDestaque = document.querySelector('.destaque')

  btnDestaque.addEventListener('click', async() => {
    renderProdutos("destaques", lojaId.id)
  })


  const menuItem = document.querySelector('.menu-item.produtos');
  if (menuItem) {
    menuItem.classList.add('selected-item');
  }
}


async function renderProdutos (filter, loja_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/produtos/${filter}/${loja_id}`);
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

