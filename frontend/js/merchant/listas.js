import { API_BASE_URL } from "../api/config.js"
import { filterLists, searchRenderLists } from "../components/searchLista.js";
import { lists } from "../mocks/listas_db.js"



export function initListas() {
  const params = new URLSearchParams(window.location.search);
  const listId = params.get("id");
  const listQuery = params.get("query");

  const menuItem = document.querySelector('.menu-item.listas');
  if (menuItem) {
    menuItem.classList.add('selected-item');
  }

  const linkPrefix = "../merchant/listas.html?id=";
  const containerSelector = ".product-list-all";

  renderLists();

  if (listQuery) {
    const awnserList = filterLists(listQuery)
    const container = document.querySelector(containerSelector)
    const search = document.querySelector(".search").value = listQuery
    container.innerHTML = ""
    searchRenderLists(listQuery);
  }
 

}

async function renderLists () {
  const container = document.querySelector('.product-list-all');
  if (!container) return;

  console.log('w')

  const response = await fetch(`${API_BASE_URL}/api/listas`)
  const listas = await response.json()
  
  container.innerHTML = listas.map((list) => createListCard(list)).join('')

}

function createListCard(list) {
 return `
        <a class="list-product-card" href="">
          <div class="list-card-images">
            <img src="${list.imageBack}" class="list-image back">
            <img src="${list.imageFront}" class="list-image front">
            <span class="badge">${list.badge}</span>
          </div>
          <div class="list-content">
            <h4>${list.nome}</h4>
            <p class="quantidade_produtos">${list.count}</p>
            <span class="metric"> 
              <img src="../assets/icons/eye.png" class="metric-icon">
              <p class="metric-text">${list.views} visualizações</p>
            </span>
          
          </div>
        </a>
      `
}