import { API_BASE_URL } from "../api/config.js"
import { searchRenderProduct } from "../components/searchProduto.js";
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'
import { btnShare } from '../components/shareButton.js'



export async function initLoja() {
  const params = new URLSearchParams(window.location.search)
  const loja_id = Number(params.get("loja_id"))
  const produtos = await renderProdutos(loja_id)
  if(produtos.length === 0) return

  btnShare(`/lojas/${loja_id}?loja_id=${loja_id}`,
    "Olha o que achei no Guide!",
    "Dê uma olhada nessa loja que encontrei no Guide:"
  )

  await renderMedia(loja_id)
  // await renderLists(loja_id);
  // await renderDestaque(loja_id)
  // await renderCategoria(loja_id);
  await renderHeaders(loja_id)
  submitPesquisa(loja_id)
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


 async function renderHeaders (loja_id) {
  const listas = await renderLists(loja_id)

  const containerLista = document.querySelector('.product-list.listas');

  if (containerLista && listas.length === 0) {
    containerLista.classList.add("hidden");
  }

  const destaques = await renderDestaque(loja_id)

  const containerDestaque = document.querySelector('.product-list.destaques');

  if (containerDestaque && destaques.length === 0) {
    containerDestaque.classList.add("hidden");
  }

  const headerDestaque = document.querySelector('.product-strip-header.destaques')
  if (!headerDestaque) return

  headerDestaque.innerHTML =  `
    <h3 class="sections-title">Em destaque</h3>
    <a class="product-view-all" href="${API_BASE_URL}/destaques/${loja_id}">Ver tudo</a>
  `

  
  const categorias = await renderCategoria(loja_id)

  const containerCategorias = document.querySelector('.product-list.categorias');

  if (containerCategorias && categorias.length === 0) {
    containerCategorias.classList.add("hidden");
  }

  //para produtos não precisa
}

async function renderMedia(loja_id) {
  const container = document.querySelector('.media-store')
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/lojas/${loja_id}`)
  const loja = await response.json()
  await insertNomeDaLoja(loja_id)

  container.innerHTML = `
    <img class="banner-media" src="${loja.banner_url}" alt="Banner da loja">
    <img class="logo-media" src="${loja.logo_url}" alt="Logo da loja"></img>
  `

}


async function renderLists (loja_id) {
  const container = document.querySelector('.list-grid');
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/listas/lojas/${loja_id}`)
  const listas = await response.json()


  const html = await Promise.all(
    listas.map(async (list) => {
      const responseProdutos = await fetch(
        `${API_BASE_URL}/api/lista-produtos/lista/${list.id}`
      );
      const produtos = await responseProdutos.json();
      
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

async function renderDestaque(loja_id) {
 const container = document.querySelector(".product-grid");
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/produtos/destaques/${loja_id}`);
  const products = await response.json();
  

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


async function renderProdutos (loja_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/produtos/ativos/${loja_id}`);
  const products = await response.json();

  container.innerHTML = products
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

        return `
            <a class="product-card-all" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${loja_id}&produto_id=${product.id}">
                <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
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

async function renderCategoria(loja_id) {
  const container = document.querySelector(".list-category");
  if (!container) return;
  // Busca apenas as categorias que possuem produtos dessa loja
  const response = await fetch(`${API_BASE_URL}/api/categorias/lojas/${loja_id}`);
  const categorias = await response.json();
  container.innerHTML = categorias
    .map((cat) => `
          <a class="circle-category" href="${API_BASE_URL}/categorias/${loja_id}?categoria_id=${cat.id}&loja_id=${loja_id}">          <img src="${cat.icone_url || '../assets/images/default.webp'}" class="category-image">
          <h4>${cat.nome}</h4>
      </a>
    `)
    .join('');

  return categorias
}
