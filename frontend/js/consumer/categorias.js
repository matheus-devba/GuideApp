
import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'
import { filterProducts, searchRenderProduct } from "../components/searchProduto.js";

export async function initCategorias() {
// Pega o caminho da URL (ex: "/categorias/3")
  const path = window.location.pathname
  
  // Divide a string pelas barras e remove elementos vazios
  const segments = path.split('/').filter(Boolean)
  
  // Pega o último segmento do caminho
  const categoria_id = segments[segments.length - 1]


  // await renderCategoria (categoria_id);
  submitPesquisa(categoria_id)
  renderCategoria(categoria_id)
 
}

function submitPesquisa(categoria_id) {
  const form = document.querySelector(".store-search-form");
  if (!form) return;

  const input = form.querySelector("input[name='query']");
  if (!input) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) return; // evita enviar busca vazia

    const responseCategoria = await fetch(
    `${API_BASE_URL}/api/categorias/${categoria_id}`
    )  
    const categoria = await responseCategoria.json()
    const nicho_id = categoria.nicho_id

    // // Abre a página de pesquisa com contexto da loja
    const params = new URLSearchParams()
    params.set("query", query)
    params.set("categoria_id", categoria_id)
    params.set("nicho_id", nicho_id)
    

    await pesquisa(categoria_id, query)
  });
}

async function renderCategoria (categoria_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

 const responseProdutos = await fetch(
    `${API_BASE_URL}/api/produtos/categorias/guide/${categoria_id}`
  )  
  const produtos = await responseProdutos.json()

 const responseCategorias = await fetch(`${API_BASE_URL}/api/categorias/${categoria_id}`)  
  const categoria = await responseCategorias.json()


  const fieldHeader = document.querySelector(".circle-category")
  fieldHeader.innerHTML = `                
    <img src=${categoria.icone_url} class="category-image">
    <h4>${categoria.nome} </h4>`


  container.innerHTML = produtos
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

        return `
            <a class="product-card-all" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${product.loja_id}&produto_id=${product.id}">
                <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
                <div class="product-info-all">
                <h2>${product.nome}</h2>
                <span class="metrics-product-all">
                    <img class="eye" hidden src="/assets/icons/eye.png">
                    <p class="views" hidden>${product.views}</p>
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

async function pesquisa(categoria_id, itemQuery) {
  let produtos = ""
    try {
        const responseProdutos = await fetch(
          `${API_BASE_URL}/api/produtos/categorias/guide/${categoria_id}`
        );
        produtos = await responseProdutos.json();

  
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
      
    // Verifica se o input realmente existe antes de manipular o DOM
    const searchInput = document.querySelector('.search');
    if (searchInput) {
      searchInput.value = itemQuery;
    }
    searchRenderProduct(itemQuery, produtos);

} 
  


