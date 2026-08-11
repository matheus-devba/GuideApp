import { API_BASE_URL } from "../api/config.js"
import { requestJSON } from "../components/responseJSON.js";
import { filterLists } from "../components/searchLista.js";



export async function initListas() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const nicho =  parts[parts.length - 1] || null;
  const listas = await requestJSON(`${API_BASE_URL}/api/listas/nichos/${nicho}`)

  // const linkPrefix = "../merchant/listas.html?id=";
  const containerSelector = ".product-list-all";
  await renderLists("", listas);
  submitPesquisa(nicho)

  return listas

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
    const listas = await initListas()
      
    // Verifica se o input realmente existe antes de manipular o DOM
    const searchInput = document.querySelector('.search');
    if (searchInput) {
      searchInput.value = itemQuery;
    }
    renderLists(itemQuery, listas);

    

} 

async function renderLists(query = "", listas) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;
  console.log(query)

  if (query !== "") {
    listas = filterLists(query, listas)
  }
  if (!listas || listas.length === 0) {
        container.innerHTML = "Sem resultados";
    } else{
  const html = await Promise.all(
    listas.map(async (list) => {
      const responseProdutos = await fetch(
        `${API_BASE_URL}/api/lista-produtos/lista/${list.id}`
      );
      const produtos = await responseProdutos.json();
      
      // if(produtos.length < 1) return //caso nao tiver produtos (mas posso colocar um <=)


      const produtoBack = produtos[0];
      const produtoFront = produtos[1];

      let imageBack = "../assets/images/default.webp"; //caso tiver 1 produto apenas na lista
      let imageFront = "../assets/images/default.webp";

      if (produtoBack) {
        imageBack = `${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtoBack.produto_id}`;
      }
      if (produtoFront) {
        imageFront = `${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtoFront.produto_id}`;
      }

      const badge = produtos.length - 2 == 0 ? "" :"+ " + produtos.length - 2


      return `
        <a class="list-product-card" href="${API_BASE_URL}/listas/${list.id}?list_id=${list.id}&loja_id=${list.loja_id}">
          <div class="list-card-images">
            <img src="${imageBack}" class="list-image back">
            <img src="${imageFront}" class="list-image front">
            ${badge == 0 ? "" : `<span class="badge">${badge}</span>`}
          </div>
          <div class="list-content">
            <h4>${list.nome}</h4>
            <p class="quantidade_produtos">${produtos.length} produto(s) salvo(s)</p>
            <span class="metric"> 
               ${list.views < 2 ? "": `<img src="../assets/icons/eye.png" class="metric-icon">`}
              ${list.views < 2 ? "": `<p class="metric-text">${list.views} visualizações</p>`}
            </span>
          </div>
        </a>
      `;
    })
  );

  container.innerHTML = html.join("");
}}

