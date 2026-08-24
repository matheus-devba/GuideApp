import { API_BASE_URL } from "../api/config.js"
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'
import { btnShare } from '../components/shareButton.js'
import { addEventos, Eventos } from "../utils/eventos.js";
import { renderFooter } from "../components/footerNavegation.js";

const params = new URLSearchParams(window.location.search)
const loja_id = Number(params.get("loja_id"))
const produto_id = Number(params.get("produto_id"))
const source = String(params.get("source")) || null

let tipo_evento = ""
if (source === "null") {
  tipo_evento = Eventos.VIEW_PRODUTO
} else {
  tipo_evento = Eventos.VIEW_PRODUTO_HOME
}

export async function initProduto() {
  await insertNomeDaLoja(loja_id)
  await renderProduto(produto_id, loja_id);
  renderFooter()
  await addEvento(produto_id, loja_id, "views", tipo_evento)


}



async function renderProduto (produto_id, loja_id) {
  const container = document.querySelector(".product-page");
  if (!container) return;

  try {
    const [loja, productSelected, imagens] = await Promise.all([
      fetch(`${API_BASE_URL}/api/lojas/${loja_id}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/produtos/${produto_id}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/produto_imagens/buscar_imagens/${produto_id}`).then(res => res.json()),
    ]);

    // const url = `/produtos/${productSelected.id}?loja_id=${loja_id}&produto_id=${productSelected.id}`
    // renderMeta(productSelected, url)
    const url = `/share/produto/${productSelected.id}?loja_id=${loja_id}`;
    console.log(url)

    btnShare(url,
      "Olha o que achei no Guide!",
      "Dê uma olhada nesse produto que encontrei no Guide:"
    )

  if (!productSelected) return;

  const categoriaId = productSelected.categoria_id

  const responseCategoria = await fetch(`${API_BASE_URL}/api/categorias/${categoriaId}`);
  const categoria = await responseCategoria.json();

  const mediaProduct = document.querySelector('.media-product')

  if (mediaProduct) {
      // Cria a estrutura do carrossel com todas as imagens e os botões
      mediaProduct.innerHTML = `
        <div class="carousel-container">
          <div class="carousel-track">
            ${imagens.map((img, index) => `
              <img class="image-product ${index === 0 ? 'active' : ''}" src="${img.url}" alt="Imagem ${index + 1}">
            `).join('')}
          </div>
          <!-- Só renderiza os botões se houver mais de uma imagem -->
          ${imagens.length > 1 ? `
            <button class="carousel-btn prev-btn" id="prevImage">&lt;</button>
            <button class="carousel-btn next-btn" id="nextImage">&gt;</button>
          ` : ''}
        </div>
      `;
      
      // Ativa o controle de cliques do carrossel
      inicializarCarrossel();
    }


   

  const initialInfo = document.querySelector('.initial-info')
    // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
  const temPromocao = productSelected.preco_promocional !== null && productSelected.preco_promocional !== "";
  
  // Define qual será o preço em destaque
  const precoExibido = temPromocao ? productSelected.preco_promocional : productSelected.preco_normal;

  const countViews = productSelected.views >= 2 ? productSelected.views + " visualizações" : "" 
  const interesses = productSelected.interesses >=2 ? productSelected.interesses + " pessoas já se interessaram" : ""

  initialInfo.innerHTML = ` 
    
    <h1>${productSelected.nome}</h1>
    <p id="idProduto" hidden>${productSelected.id}
    <p id="ativo" hidden>${productSelected.ativo}
    <p>Classificação: ${categoria.nome}</p>
    <hr>

    <div class="left-group">
        <span class="promocional-price">${formatMoney(precoExibido)} </span>
        <span class="normal-price">${temPromocao ? formatMoney(productSelected.preco_normal) : ""}</span>
            <div class="metrics-product-all">
              <div class="views-wrapper">
                <img class="eye" ${countViews === "" ? "hidden" : ""} src="../assets/icons/eye.png">
                <p class="views">${countViews}</p>
              </div>
              <p class="interesses">${interesses}</p>
            </div>
    </div>

    <div class="right-group">  
        <a class="cta-product" href="" target="_blank" rel="noopener noreferrer">
            <img src="../assets/icons/whatsapp.png">
            <h8>Tenho Interesse</h8>
        </a>
    </div>

    <div class="description-group ${productSelected.descricao == "" || productSelected.descricao == null ? "hidden":""} ">
      <h4 class="description-title"> Descrição </h4>
      <p class="description">${productSelected.descricao} </p>
    </div>
  `

    addInteresse(productSelected, loja, precoExibido) // para botao de interesse

} catch (error) {
    console.error("Erro ao buscar dados:", error);
    return;
  }

  
}

function inicializarCarrossel() {
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  const imagens = document.querySelectorAll('.carousel-track .image-product');
  
  if (!imagens.length) return;
  
  let currentIndex = 0;

  function mostrarImagem(index) {
    // Remove a classe active de todas as imagens
    imagens.forEach(img => img.classList.remove('active'));
    // Adiciona a classe active apenas na imagem atual
    imagens[index].classList.add('active');
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      // Volta uma imagem, ou vai para a última se estiver na primeira
      currentIndex = (currentIndex === 0) ? imagens.length - 1 : currentIndex - 1;
      mostrarImagem(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // Avança uma imagem, ou volta para a primeira se estiver na última
      currentIndex = (currentIndex === imagens.length - 1) ? 0 : currentIndex + 1;
      mostrarImagem(currentIndex);
    });
  }
}


function addInteresse(productSelected,loja, precoExibido) {
  let textoMensagem = `Olá \u{1F60D}! Vim do Guide e tenho interesse no produto ${productSelected.nome} no valor de ${formatMoney(precoExibido)}\n\n`;

  const textoCodificado = encodeURIComponent(textoMensagem);
    
  let telefone = loja.whatsapp ? loja.whatsapp.replace(/\D/g, '') : '';
    if (telefone && !telefone.startsWith('55')) {
      telefone = `55${telefone}`;
    }

  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${telefone}&text=${textoCodificado}`;
  
  const botao = document.querySelector('.cta-product')
  if(!botao) return

  botao.addEventListener("click", async(e) => {
    e.preventDefault()
    window.open(urlWhatsapp, '_blank', 'noopener,noreferrer');

    if (source) {
      await addEvento(produto_id, loja_id, "interesse", Eventos.INTERESSE_PRODUTO_HOME)
    }
    else {
      await addEvento(produto_id, loja_id, "interesse", Eventos.INTERESSE_PRODUTO)
    }
    
  })
}
  

async function addEvento(produto_id, loja_id, tipo, tipo_evento) {
  const payload = {
    tipo_evento: tipo_evento,
    produto_id: produto_id,
    loja_id: loja_id
  }

  const rotaView = `/api/produtos/newView/${produto_id}`
  const rotaInteresse = `/api/produtos/addInteresse/${produto_id}`

  if (tipo == "views") {
    await addEventos(rotaView, payload)
    return
  }

  if (tipo == "interesse") {
    await addEventos(rotaInteresse, payload)
    return
  }
}