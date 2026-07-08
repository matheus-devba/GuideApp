import { lists } from "../mocks/listas_db.js"
import { filterLists, searchRenderLists } from "../components/searchLista.js";
import { renderLists } from "../consumer/loja.js"


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

  renderLists(linkPrefix, containerSelector);

  if (listQuery) {
    const awnserList = filterLists(listQuery)
    const container = document.querySelector(containerSelector)
    const search = document.querySelector(".search").value = listQuery
    container.innerHTML = ""
    searchRenderLists(listQuery);
  }
 

}

