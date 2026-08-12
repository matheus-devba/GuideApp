import { API_BASE_URL } from "../api/config.js";
import { embaralharArray } from "../components/embaralharArray.js";
import { requestJSON } from "../components/responseJSON.js";
import { formatMoney } from "../utils/formatMoney.js";
import { filterProducts, searchRenderProduct } from "../components/searchProduto.js";
import { renderFooter } from "../components/footerNavegation.js";

export async function initPromocoes() {
 
  const parts = window.location.pathname.split("/").filter(Boolean);
  const nicho =  parts[parts.length - 1] || null;
  
    const promocoes = await (
        requestJSON(`${API_BASE_URL}/api/produtos/promocoes/nichos/${nicho}`) );
  
  renderProdutos(promocoes, nicho);
  submitPesquisa(nicho)
  renderFooter()

  return promocoes
}

async function renderProdutos (promocoes, nicho_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;


   let products = embaralharArray(promocoes)
 
 
   if (products.length == 0) {
     const allProducts = await requestJSON(`${API_BASE_URL}/api/produtos/nichos/${nicho_id}`)
     products = embaralharArray(allProducts.slice(0,allProducts.length))
   }
 
 
   container.innerHTML = products
     .map(
       (product) => {
         // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
         const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
         
         // Define qual será o preço em destaque
         const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;
         const countViews = product.views >= 2 ? product.views + " visualizações" : "" 
 
 
         return `
             <a class="product-card" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${product.loja_id}&produto_id=${product.id}" >
             <img class="product-image" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
             <div class="product-info-all">
               <h3>${product.nome}</h3>
               <span class="metrics-product-all">
                 <div class="views-wrapper">
                   <img class="eye" ${countViews === "" ? "hidden" : ""} src="../assets/icons/eye.png">
                   <p class="views">${countViews}</p>
                 </div>
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

function submitPesquisa(nicho_id) {
  const form = document.querySelector(".store-search-form");
  if (!form) return;

  const input = form.querySelector("input[name='query']");
  if (!input) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) return; // evita enviar busca vazia


    // // Abre a página de pesquisa com contexto da loja
    const params = new URLSearchParams()
    params.set("query", query)
    params.set("nicho_id", nicho_id)
    
    
    await pesquisa(query)
  });
}

async function pesquisa(itemQuery) {
    const produtos = await initPromocoes()
      
    // Verifica se o input realmente existe antes de manipular o DOM
    const searchInput = document.querySelector('.search');
    if (searchInput) {
      searchInput.value = itemQuery;
    }
    searchRenderProduct(itemQuery, produtos);

    

} 

