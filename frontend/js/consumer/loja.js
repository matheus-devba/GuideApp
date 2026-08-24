import { API_BASE_URL } from "../api/config.js"
import { searchRenderProduct } from "../components/searchProduto.js";
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'
import { btnShare } from '../components/shareButton.js'
import { requestJSON } from "../components/responseJSON.js";
import { renderFooter } from "../components/footerNavegation.js";
import { addEventos, Eventos } from "../utils/eventos.js";

const params = new URLSearchParams(window.location.search)
const source = String(params.get("source")) || null

let tipo_evento = ""
if (source === "null") {
  tipo_evento = Eventos.VIEW_LOJA
} else {
  tipo_evento = Eventos.VIEW_LOJA_HOME 
}


function renderLojaTopo(loja, loja_id) {
  const container = document.querySelector(".media-store");
  if (container) {
    container.innerHTML = `
      <img class="banner-media" src="${loja.banner_url}" alt="Banner da loja" loading="eager" fetchpriority="high" decoding="async" width="860" height="380">
      <img class="logo-media" src="${loja.logo_url}" alt="Logo da loja" loading="eager" decoding="async" width="90" height="90">
    `;
  }

  const title = document.querySelector(".store-title");
  if (title) title.textContent = loja.nome;

  const totalVisualizacoes = Number(loja.views) || 0;

  const textoVisualizacoes =
    totalVisualizacoes === 1
      ? "1 visualização"
      : `${totalVisualizacoes} visualizações`;

  btnShare(
    `/share/loja/${loja_id}`,
    loja.nome,
    `${textoVisualizacoes}. Conheça a ${loja.nome} no Guide!`
  );
}

function getLojaId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("loja_id"));
}

export async function initLoja() {
  const loja_id = getLojaId()
  if (!loja_id) return;


  const back = document.querySelector('.top-icon-btn.back');
  if(!back) return
  back.addEventListener("click", (e) => {
    e.preventDefault()
    window.location.href = `${API_BASE_URL}/home`
  })
  renderFooter()


  const [loja, produtos, listas, destaques, categorias] = await Promise.all([
    requestJSON(`${API_BASE_URL}/api/lojas/${loja_id}`),
    requestJSON(`${API_BASE_URL}/api/produtos/ativos/${loja_id}`),
    requestJSON(`${API_BASE_URL}/api/listas/lojas/${loja_id}`),
    requestJSON(`${API_BASE_URL}/api/produtos/destaques/${loja_id}`),
    requestJSON(`${API_BASE_URL}/api/categorias/lojas/${loja_id}`),
  ]);

  renderLojaTopo(loja, loja_id);

  if (!produtos.length) return;

  await Promise.all([
    renderProdutosFromData(produtos, loja_id),
    renderListsFromData(listas,produtos, loja_id),
    renderDestaqueFromData(destaques, loja_id),
    renderCategoriaFromData(categorias, loja_id),
  ]);

  //headers
  const containerLista = document.querySelector(".product-list.listas");
  const containerDestaque = document.querySelector(".product-list.destaques");
  const containerCategoria = document.querySelector(".list-category");

  if (containerLista && !listas.length) containerLista.classList.add("hidden");
  if (containerDestaque && !destaques.length) containerDestaque.classList.add("hidden");
  if (containerCategoria && !categorias.length) containerCategoria.closest(".product-list")?.classList.add("hidden");

  submitPesquisa(loja_id);
  await addEvento(loja_id, "views", tipo_evento)

}

 function submitPesquisa(loja_id) {
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
    

    window.location.href = `${API_BASE_URL}/consumer/pesquisa/${loja_id}?${params.toString()}`
  });
}


async function renderListsFromData (listas, produtos, loja_id) {
  const container = document.querySelector('.list-grid');
  if (!container) return;




  const html = await Promise.all(
    listas.map(async (list) => {
      const responseProdutos = await fetch(
        `${API_BASE_URL}/api/lista-produtos/lista/${list.id}`
      );
      const produtos = await responseProdutos.json()

      
      if(produtos.length < 1) return //caso nao tiver produtos (mas posso colocar um <=)


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
        <a class="list-product-card" href="${API_BASE_URL}/listas/${list.id}?list_id=${list.id}&loja_id=${loja_id}">
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
  return listas
}

async function renderDestaqueFromData(destaques, loja_id) {
 const container = document.querySelector(".product-grid");
  if (!container) return;

  const products = destaques
  

  container.innerHTML = products
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

        return `
            <a class="product-card" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${loja_id}&produto_id=${product.id}" >
            <img class="product-image" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
            <div class="product-info-all">
              <h2>${product.nome}</h2>
              <span class="metrics-product-all">
                    <img class="eye" hidden src="../assets/icons/eye.png">
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

    return products
}


async function renderProdutosFromData (products, loja_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

        const countViews = product.views >= 2 ? product.views + " visualizações" : "" 

        return `
            <a class="product-card-all" data-id="${product.id}" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${loja_id}&produto_id=${product.id}">
                <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
                <div class="product-info-all">
                <h2>${product.nome}</h2>
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

    return products
}

async function renderCategoriaFromData(categorias, loja_id) {
  const container = document.querySelector(".list-category");
  if (!container) return;
  // Busca apenas as categorias que possuem produtos dessa loja

  container.innerHTML = categorias
    .map((cat) => `
          <a class="circle-category" href="${API_BASE_URL}/categorias/${loja_id}?categoria_id=${cat.id}&loja_id=${loja_id}">          <img src="${cat.icone_url || '../assets/images/default.webp'}" class="category-image">
          <h4>${cat.nome}</h4>
      </a>
    `)
    .join('');

  return categorias
}

async function addEvento( loja_id, tipo, tipo_evento) {
  const payload = {
    tipo_evento: tipo_evento,
    loja_id: loja_id
  }

  const rotaView = `/api/lojas/newView/${loja_id}`

  await addEventos(rotaView, payload)

  

}
