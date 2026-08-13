import { API_BASE_URL } from "../api/config.js";
import { formatMoney } from '../utils/formatMoney.js';
import { btnShare } from '../components/shareButton.js';
import { embaralharArray } from "../components/embaralharArray.js";
import { requestJSON } from "../components/responseJSON.js";
import { renderFooter } from "../components/footerNavegation.js";

function renderBanner() {
  const container = document.querySelector(".media-banner");
  if (container) {
    container.innerHTML = `
      <img class="banner-media" src="../assets/images/banner-guide.png" loading="eager" fetchpriority="high" decoding="async">
    `;
  }
}

function compartilhar() {
  btnShare(
    '/home',
    "Olha o que achei no Guide!",
    "Dê uma olhada nessa nova plataforma!"
  );
}

function ouvirMudancaDeNicho(callback) {
  const nichoButtons = document.querySelectorAll('.niche-btn');

  nichoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const activeBtn = document.querySelector('.niche-btn.active');
      if (activeBtn) activeBtn.classList.remove('active');
      
      button.classList.add('active');
      callback(button.value);
    });
  });
}

function getNichoAtual() {
  const botaoAtivo = document.querySelector('.niche-btn.active');
  return botaoAtivo ? botaoAtivo.value : null;
}

// Busca paralela e sem duplicidade de requisições
async function carregarDadosNicho(nicho) {
  const [lojas, produtos, listas, promocoes, categorias] = await Promise.all([
    requestJSON(`${API_BASE_URL}/api/lojas/nichos/${nicho}`),
    requestJSON(`${API_BASE_URL}/api/produtos/nichos/${nicho}`),
    requestJSON(`${API_BASE_URL}/api/listas/nichos/${nicho}`),
    requestJSON(`${API_BASE_URL}/api/produtos/promocoes/nichos/${nicho}`),
    requestJSON(`${API_BASE_URL}/api/categorias/nicho/${nicho}`)
  ]);

  return { lojas, produtos, listas, promocoes, categorias };
}

export async function initHome() {
  renderBanner();
  renderFooter()
  let nichoAtual = getNichoAtual();
  
  await atualizarTela(nichoAtual);
  compartilhar();

  ouvirMudancaDeNicho(async (nichoSelecionado) => {
    if (nichoSelecionado === nichoAtual) return;
    nichoAtual = nichoSelecionado;
    await atualizarTela(nichoAtual);
  });
  
}

async function atualizarTela(nicho) {
  viewAll(nicho);
  
  const { lojas, produtos, listas, promocoes, categorias } = await carregarDadosNicho(nicho);

  await Promise.all([
    renderProdutosFromData(produtos),
    renderListsFromData(listas),
    renderPromocoesFromData(promocoes, nicho),
    renderCategoriaFromData(categorias),
    renderLojasFromData(lojas)
  ]);
}


function viewAll(nichoAtual) {
  const viewAllListas = document.getElementById('listas');
  if (viewAllListas) viewAllListas.href = `listasAll/${nichoAtual}`;

  const viewAllPromocoes = document.getElementById('promocoes');
  if (viewAllPromocoes) viewAllPromocoes.href = `promocoesAll/${nichoAtual}`;

  const viewAllLojas = document.getElementById('lojas');
  if (viewAllLojas) viewAllLojas.href = `lojasAll/${nichoAtual}`;
}

async function renderListsFromData(listas) {
  const container = document.querySelector('.list-grid.listas');
  const section = document.querySelector('.product-list.listas');
  if (!container) return;

  const temDados = listas && listas.length > 0;
  if (section) section.classList.toggle("hidden", !temDados);

  if (!temDados) {
    container.innerHTML = "";
    return;
  }

  // OTIMIZAÇÃO: Limita para 15 PRIMEIRO, antes de fazer os fetches de imagens
  const listasExibicao = embaralharArray(listas).slice(0, 15);

  const html = await Promise.all(
    listasExibicao.map(async (list) => {
      try {
        const responseProdutos = await fetch(`${API_BASE_URL}/api/lista-produtos/lista/${list.id}`);
        const produtos = await responseProdutos.json();

        if (!produtos || produtos.length < 1) return "";

        const produtoBack = produtos[0];
        const produtoFront = produtos[1];

        const imageBack = produtoBack ? `${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtoBack.produto_id}` : "../assets/images/default.webp";
        const imageFront = produtoFront ? `${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtoFront.produto_id}` : "../assets/images/default.webp";

        const badgeCount = produtos.length - 2;
        const badgeHtml = badgeCount > 0 ? `<span class="badge">+ ${badgeCount}</span>` : "";

        return `
          <a class="list-product-card" href="${API_BASE_URL}/listas/${list.id}?list_id=${list.id}&loja_id=${list.loja_id}&source=home">
            <div class="list-card-images">
              <img src="${imageBack}" class="list-image back" loading="lazy">
              <img src="${imageFront}" class="list-image front" loading="lazy">
              ${badgeHtml}
            </div>
            <div class="list-content">
              <h4>${list.nome}</h4>
              <p class="quantidade_produtos">${produtos.length} produto(s) salvo(s)</p>
              <span class="metric"> 
                ${list.views >= 2 ? `<img src="../assets/icons/eye.png" class="metric-icon"><p class="metric-text">${list.views} visualizações</p>` : ""}
              </span>
            </div>
          </a>
        `;
      } catch (err) {
        return "";
      }
    })
  );

  container.innerHTML = html.join("");
}

async function renderPromocoesFromData(promocoes, nicho_id) {
  const container = document.querySelector(".product-grid.promocoes");
  const section = document.querySelector('.product-list.promocoes');
  if (!container) return;

  let products = promocoes || [];

  if (products.length === 0) {
    const allProducts = await requestJSON(`${API_BASE_URL}/api/produtos/nichos/${nicho_id}`);
    products = allProducts || [];
  }

  const temDados = products.length > 0;
  if (section) section.classList.toggle("hidden", !temDados);

  if (!temDados) {
    container.innerHTML = "";
    return;
  }

  const exibicao = embaralharArray(products).slice(0, 10);

  container.innerHTML = exibicao.map((product) => {
    const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
    const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;
    const countViews = product.views >= 2 ? `${product.views} visualizações` : "";

    return `
      <a class="product-card" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${product.loja_id}&produto_id=${product.id}&source=home"">
        <img class="product-image" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}" loading="lazy">
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
              <span class="promocional-price">${formatMoney(precoExibido)}</span>
              <span class="normal-price-all">${temPromocao ? formatMoney(product.preco_normal) : ""}</span>
            </div>
            <button type="button">Ver</button>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

async function renderProdutosFromData(products) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  if (!products || products.length < 1) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = products.map((product) => {
    const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
    const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;
    const countViews = product.views >= 2 ? `${product.views} visualizações` : "";

    return `
      <a class="product-card-all" data-id="${product.id}" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${product.loja_id}&produto_id=${product.id}&source=home"">
        <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}" loading="lazy">
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
              <span class="promocional-price">${formatMoney(precoExibido)}</span>
              <span class="normal-price-all">${temPromocao ? formatMoney(product.preco_normal) : ""}</span>
            </div>
            <button type="button">Ver</button>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

async function renderLojasFromData(lojas) {
  const container = document.querySelector(".list-grid.lojas");
  const section = document.querySelector('.stores-list');
  if (!container) return;

  const temDados = lojas && lojas.length > 0;
  if (section) section.classList.toggle("hidden", !temDados);

  if (!temDados) {
    container.innerHTML = "";
    return;
  }

  const exibicao = embaralharArray(lojas).slice(0, 15);

  container.innerHTML = exibicao.map((loja) => `
    <div class="loja-content">
      <a class="list-product-card" href="${API_BASE_URL}/lojas/${loja.id}?loja_id=${loja.id}&source=home">
        <img src="${loja.logo_url}" class="logo-store" loading="lazy">
        <div class="list-content">
          <h4>${loja.nome}</h4>
          <span class="metric"> 
            ${loja.views >= 2 ? `<img src="../assets/icons/eye.png" class="metric-icon"><p class="metric-text">${loja.views} visualizações</p>` : ""}
          </span>
        </div>
      </a>
    </div>
  `).join('');
}

async function renderCategoriaFromData(categorias) {
  const container = document.querySelector(".list-category");
  const section = document.querySelector('.product-list.categorias');
  if (!container) return;

  if (!categorias || categorias.length < 1) {
    if (section) section.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  // 1. Faz as verificações de produtos em paralelo para todas as categorias
  const categoriasValidadas = await Promise.all(
    categorias.map(async (cat) => {
      try {
        const produtos = await requestJSON(`${API_BASE_URL}/api/produtos/categorias/guide/${cat.id}`);
        // Retorna a categoria se tiver pelo menos 1 produto, senão retorna null
        return (produtos && produtos.length > 0) ? cat : null;
      } catch (err) {
        return null;
      }
    })
  );

  // 2. Filtra removendo as categorias nulas (que não tinham produtos)
  const categoriasComProdutos = categoriasValidadas.filter(cat => cat !== null);

  // 3. Controla a visibilidade da seção
  const temDados = categoriasComProdutos.length > 0;
  if (section) section.classList.toggle("hidden", !temDados);

  if (!temDados) {
    container.innerHTML = "";
    return;
  }

  // 4. Renderiza apenas as categorias válidas
  container.innerHTML = categoriasComProdutos.map((cat) => `
    <a class="circle-category" href="${API_BASE_URL}/categorias/guide/${cat.id}">
      <img src="${cat.icone_url || '../assets/images/default.webp'}" class="category-image" loading="lazy">
      <h4>${cat.nome}</h4>
    </a>
  `).join('');
}