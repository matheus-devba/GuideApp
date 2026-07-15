export function initLojas() {
  
renderLojas()

}

async function renderLojas() {
    try {
        
        const response = await fetch('/api/lojas'); // 1. Aguarda a resposta da requisição HTTP
        const lojas = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript


        const container = document.querySelector(".list-grid");
        if (!container) return;

        // 4. Mapeia a Array diretamente (sem JSON.stringify)
        container.innerHTML = lojas.map((loja) => createListLojas(loja)).join("");
        
    } catch (error) {
        console.error("Erro ao buscar lojas do servidor:", error);
    }




}

function createListLojas(list) {
 return `
        <a class="list-product-card" href="/lojas/${list.id}">
        <img src="${list.logo_url}" class="logo-store">
          <div class="list-content">
            <h4>${list.nome}</h4>
            <p>${list.nicho}</p>
            <span class="metric"> 
              ${list.views < 2 ? "" : `<img src="../assets/icons/eye.png" class="metric-icon">`}
              <p class="metric-text">${list.views < 2 ? "" : `${list.views} visualizações`}</p>
            </span>
          
          </div>
        </a>
      `
}