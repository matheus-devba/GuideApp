import { API_BASE_URL } from "../api/config.js"
import { embaralharArray } from "../components/embaralharArray.js";
import { requestJSON } from "../components/responseJSON.js";

export function initLojas() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const nicho =  parts[parts.length - 1] || null;
  
renderLojas(nicho)

}

async function renderLojas(nicho_id) {
    try {
        
        const lojas = await requestJSON(`${API_BASE_URL}/api/lojas/nichos/${nicho_id}`); // 1. Aguarda a resposta da requisição HTTP
        await createListLojas(lojas)
        
    } catch (error) {
        console.error("Erro ao buscar lojas do servidor:", error);
    }


}

async function createListLojas(lists) {
  const container = document.querySelector(".list-grid");
  if (!container) return;

  const htmlPromises = lists.map(async (list) => {
      const countViews = list.views >= 2 ? list.views + " visualizações" : "" 
      const qtdProdutos = await requestJSON(`${API_BASE_URL}/api/produtos/ativos/${list.id}`)
  



     return `
        <a class="list-product-card" href="${API_BASE_URL}/lojas/${list.id}?loja_id=${list.id}">
        <img src="${list.logo_url}" class="logo-store">
          <div class="list-content">
            <h4>${list.nome}</h4>
            <p class="muted">${qtdProdutos.length} produtos ativos</p>
              <span class="metrics-product-all">
                <div class="views-wrapper">
                  <img class="eye" ${countViews === "" ? "hidden" : ""} src="../assets/icons/eye.png">
                  <p class="views">${countViews}</p>
                </div>
              </span>
          
          </div>
        </a>
      `
       })

    Promise.all(htmlPromises).then((htmlArray) => {
    container.innerHTML = htmlArray.join('');
});
}