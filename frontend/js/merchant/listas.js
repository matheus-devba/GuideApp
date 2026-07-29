import { API_BASE_URL } from "../api/config.js"
import { filterLists, searchRenderLists } from "../components/searchLista.js";
import { verificarUser, getLojaId, insertNomeDaLoja, verificacaoUsuario } from "../services/requisicoesMerchant.js";



export async function initListas() {
  const params = new URLSearchParams(window.location.search);
  const listQuery = params.get("query");

  const menuItem = document.querySelector('.menu-item.listas');
  if (menuItem) {
    menuItem.classList.add('selected-item');
  }
  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  const lojaId = await getLojaId()

  const responseLists = await fetch(`${API_BASE_URL}/api/listas/lojas/${lojaId.id}`);
  const listas = await responseLists.json();

  // const linkPrefix = "../merchant/listas.html?id=";
  const containerSelector = ".product-list-all";

  await renderLists(lojaId);

  if (listQuery) {
    // const awnserList = filterLists(listQuery)
    const container = document.querySelector(containerSelector)
    const search = document.querySelector(".search").value = listQuery
    container.innerHTML = ""
    await searchRenderLists(listQuery, listas);
  }


 const actions = document.querySelector('.actions')
 actions.innerHTML = `
    <a class="new-product-btn" href="${API_BASE_URL}/listas/merchant/new">Nova Lista +</a>
 `

}

async function renderLists(lojaId) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const responseListas = await fetch(`${API_BASE_URL}/api/listas/lojas/${lojaId.id}`);
  const listas = await responseListas.json();


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

      return `
        <a class="list-product-card" href="${API_BASE_URL}/listas/merchant/${list.id}">
          <div class="list-card-images">
            <img src="${imageBack}" class="list-image back">
            <img src="${imageFront}" class="list-image front">
            <span class="badge">+${produtos.length}</span>
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
}

