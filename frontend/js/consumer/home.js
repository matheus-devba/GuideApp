import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'
import { btnShare } from '../components/shareButton.js'
import { embaralharArray } from "../components/embaralharArray.js";
import { requestJSON } from "../components/responseJSON.js";


function renderBanner() {
  const container = document.querySelector(".media-banner");
  if (container) {
    container.innerHTML = `
      <img class="banner-media" src="../assets/images/lojas/banners/perfumaria-store.jpeg" alt="Banner da loja" loading="eager" fetchpriority="high" decoding="async">
    `;
  }
}

function compartilhar (rota) {
    rota = '/home'
    btnShare(
        rota,
        "Olha o que achei no Guide!",
        "Dê uma olhada nessa nova plataforma!"
  );
}

// Adicione um parâmetro "callback" para avisar quando mudar
function ouvirMudancaDeNicho(callback) {
    const nichoAtivado = document.querySelector('.niche-btn.active');

    // 2. Add click event to switch between 'Moda' and 'Cosméticos'
    const nichoButtons = document.querySelectorAll('.niche-btn');


    nichoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            // Remove 'active' class from whichever button currently has it
            document.querySelector('.niche-btn.active').classList.remove('active');
            
            // Add 'active' class to the clicked button
            button.classList.add('active');
            
            // Get the value of the active niche (e.g., "moda" or "cosmeticos")
            // nichoSelecionado = button.getAttribute('data-niche');
            const nicho = button.value

            callback(nicho)
            
        });
    });

   
  

}

function getNichoAtual() {
    const botaoAtivo = document.querySelector('.niche-btn.active');
    return botaoAtivo ? botaoAtivo.value : null;
}

async function promisses(nicho) {
    const [lojas, produtos, listas, promocoes, categorias] = await Promise.all([
        requestJSON(`${API_BASE_URL}/api/lojas/nichos/${nicho}`),
        requestJSON(`${API_BASE_URL}/api/produtos/nichos/${nicho}`),
        requestJSON(`${API_BASE_URL}/api/listas/nichos/${nicho}`),
        requestJSON(`${API_BASE_URL}/api/produtos/promocoes/nichos/${nicho}`),
        requestJSON(`${API_BASE_URL}/api/categorias/nicho/${nicho}`),
        requestJSON(`${API_BASE_URL}/api/lojas/nichos/${nicho}`),
    ]);

    return [lojas, produtos, listas, promocoes, categorias]
}



export async function initHome() {
    renderBanner()
    let nichoAtual = getNichoAtual();
    await atualizarTela(nichoAtual);
    
    // 2. Escuta os cliques e atualiza em tempo real
    ouvirMudancaDeNicho(async (nichoSelecionado) => {
        if (nichoSelecionado === nichoAtual) {
            return;
        }
        
        const [lojas, produtos, listas, promocoes, categorias] = await promisses(nichoSelecionado);
        nichoAtual = nichoSelecionado;
        atualizarTela(nichoAtual)
        
    })
   compartilhar()
   viewAll(nichoAtual)
   
}

async function atualizarTela(nicho) {
    const [lojas, produtos, listas, promocoes, categorias] = await promisses(nicho);
   
    await Promise.all([
        renderProdutosFromData(produtos),
        renderListsFromData(listas, produtos),
        renderPromocoesFromData(promocoes, nicho),
        renderCategoriaFromData(categorias),
        renderLojasFromData(lojas),
        
    ]);
    
}

// Função pura para embaralhar sem alterar o array original


function viewAll(nichoAtual) {
  const viewAllListas = document.getElementById('listas')
  viewAllListas.href= `listasAll/${nichoAtual}`

  const viewAllProdutosPromocoes = document.getElementById('promocoes')
  viewAllProdutosPromocoes.href= `promocoesAll/${nichoAtual}`

  const viewAllLojas = document.getElementById('lojas')
  viewAllLojas.href= `lojasAll/${nichoAtual}`

}

async function renderAllProducts() {

}

async function renderListsFromData (listas, produtos) {
  const container = document.querySelector('.list-grid.listas');
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
        <a class="list-product-card" href="${API_BASE_URL}/listas/${list.id}?list_id=${list.id}&loja_id=${list.loja_id}">
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

  const array = embaralharArray(html.slice(0,15))
  container.innerHTML = array.join("");
  return listas
}

async function renderPromocoesFromData(promocoes, nicho_id) {
 const container = document.querySelector(".product-grid.promocoes");
  if (!container) return;

  let products = embaralharArray(promocoes.slice(0,10))


  if (products.length == 0) {
    const allProducts = await requestJSON(`${API_BASE_URL}/api/produtos/nichos/${nicho_id}`)
    products = embaralharArray(allProducts.slice(0,10))
  }


  

  container.innerHTML = products
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;
        const countViews = product.views >= 2 ? product.views + " visualizações" : "" 


        return `
            <a class="product-card" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${product.loja_id}&produto_id=${product.id}" >
            <img class="product-image" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
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

async function renderProdutosFromData (products) {
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
            <a class="product-card-all" data-id="${product.id}" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${product.loja_id}&produto_id=${product.id}">
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

async function renderLojasFromData(lojas) {
  const container = document.querySelector(".list-grid.lojas");
  if (!container) return;
  // Busca apenas as categorias que possuem produtos dessa loja

//   const nicho = requestJSON(`${API_BASE_URL}/api/nicho`)

  container.innerHTML = lojas
    .map((loja) => `
        <div class="loja-content">
            <a class="list-product-card" href="${API_BASE_URL}/lojas/${loja.id}?loja_id=${loja.id}">
                <img src="${loja.logo_url}" class="logo-store">
                <div class="list-content">
                    <h4>${loja.nome}</h4>
                    <p>${loja.nicho_id}</p>
                    <span class="metric"> 
                    ${loja.views < 2 ? "" : `<img src="../assets/icons/eye.png" class="metric-icon">`}
                    <p class="metric-text">${loja.views < 2 ? "" : `${loja.views} visualizações`}</p>
                    </span>
                
                </div>
            </a>
        </div>
    `)
    .join('');
  return embaralharArray(lojas.slice(0,15))
}

async function renderCategoriaFromData(categorias) {
  const container = document.querySelector(".list-category");
  if (!container) return;
  // Busca apenas as categorias que possuem produtos dessa loja


  container.innerHTML = categorias
    .map((cat) => `
          <a class="circle-category" href="${API_BASE_URL}/categorias/guide/${cat.id}">
          <img src="${cat.icone_url || '../assets/images/default.webp'}" class="category-image">
          <h4>${cat.nome}</h4>
      </a>
    `)
    .join('');

  return categorias
}
