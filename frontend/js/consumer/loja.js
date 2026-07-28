
import { lists } from "../mocks/listas_db.js"
import { destaques } from "../mocks/destaques_db.js"
import { products } from "../mocks/produtos_db.js";
import { categorias } from "../mocks/categorias_db.js";

import { API_BASE_URL } from "../api/config.js"
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'



export async function initLoja() {
  const pathParts = window.location.pathname.split("/")
  const loja_id = Number(pathParts[pathParts.length - 1])

  const linkPrefix = "../consumer/lista.html?id=";

  await renderMedia(loja_id)
  await insertNomeDaLoja(loja_id)
  await renderLists(loja_id);
  await renderDestaque(loja_id)
  await renderCategoria(loja_id);
   await renderProdutos(loja_id)
}


async function renderMedia(loja_id) {
  const container = document.querySelector('.media-store')
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/lojas/${loja_id}`)
  const loja = await response.json()

  container.innerHTML = `
    <img class="banner-media" src="${loja.banner_url}" alt="Banner da loja">
    <img class="logo-media" src="${loja.logo_url}" alt="Logo da loja"></img>
  `

}

function createCard(product) {
  return `
        <a class="product-card" href="../consumer/produto.html?id=${product.id}" >
            <img class="product-image" src="${product.image}">
            <div class="product-info-all">
              <h2>${product.name}</h2>
              <span class="metrics-product">
                  <p class="rate">${product.rate}</p>
                  <p class="views">${product.view} pessoas já viram</p>
              </span>
              <div class="product-footer">
                  <div class="price-group">
                        <span class="promocional-price">R$ ${product.promocionalPrice} </span>
                        <span class="normal-price-all">R$ ${product.normalPrice}</span>
                  </div>
                  <button type="button">Ver</button>
              </div>
            </div>  
        </a>
      `
}

function createCardAll(product) {
  return `
        <a class="product-card-all" href="../consumer/produto.html?id=${product.id}" >
            <img class="product-image-all" src="${product.image}">
            <div class="product-info-all">
              <h2>${product.name}</h2>
              <span class="metrics-product-all">
                  <p class="rate">${product.rate}</p>
                  <p class="views">${product.view}</p>
              </span>
              <div class="product-footer">
                  <div class="price-group">
                        <span class="promocional-price">R$ ${product.promocionalPrice} </span>
                        <span class="normal-price-all">R$ ${product.normalPrice}</span>
                  </div>
                  <button type="button">Ver</button>
              </div>
        
            </div>  
        </a>
      `
}

function createListCategory(list) {
  return `
    <a class="circle-category" href="../consumer/categoria.html?id=${list.id}">
        <img src=${list.image} class="category-image">
        <h4>${list.name} </h4>
    </a>
  `
}

async function renderLists (loja_id) {
  const container = document.querySelector('.list-grid');
  if (!container) return;

  const response = await fetch(`${API_BASE_URL}/api/listas/merchant/lojas/${loja_id}`)
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
            <a class="product-card" href="${API_BASE_URL}/produtos/${product.id}" >
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
            <a class="product-card-all" href="${API_BASE_URL}/produtos/${product.id}">
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
}

async function renderCategoria(loja_id) {
  const container = document.querySelector(".list-category");
  if (!container) return;
  // Busca apenas as categorias que possuem produtos dessa loja
  const response = await fetch(`${API_BASE_URL}/api/categorias/lojas/${loja_id}`);
  const categorias = await response.json();
  container.innerHTML = categorias
    .map((cat) => `
      <a class="circle-category" href="../consumer/categoria.html?id=${cat.id}">
          <img src="${cat.icone_url || '../assets/images/default.webp'}" class="category-image">
          <h4>${cat.nome}</h4>
      </a>
    `)
    .join('');
}
