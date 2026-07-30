import { API_BASE_URL } from "../api/config.js"
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'
import { btnSearch } from '../components/searchButton.js'

export async function initProduto() {
  const params = new URLSearchParams(window.location.search)
  const loja_id = Number(params.get("loja_id"))
  const produto_id = Number(params.get("produto_id"))
  await insertNomeDaLoja(loja_id)
  await renderProduto(produto_id, loja_id);
  
  
}



async function renderProduto (produto_id, loja_id) {
  const container = document.querySelector(".product-page");
  if (!container) return;


  const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/${produto_id}`);
  const productSelected = await responseProdutos.json();

  btnSearch(`/produtos/${productSelected.id}?loja_id=${loja_id}&produto_id=${productSelected.id}`)

  if (!productSelected) return;

  const categoriaId = productSelected.categoria_id

  const responseCategoria = await fetch(`${API_BASE_URL}/api/categorias/${categoriaId}`);
  const categoria = await responseCategoria.json();

  const responseLoja = await fetch(`${API_BASE_URL}/api/lojas/${loja_id}`)
  const loja = await responseLoja.json()

  const responseImagens = await fetch(`${API_BASE_URL}/api/produto_imagens/buscar_imagens/${produto_id}`)
  const imagens = await responseImagens.json()

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




  let textoMensagem = `Olá \u{1F60D}! Vim do Guide e tenho interesse no produto ${productSelected.nome} no valor de ${formatMoney(precoExibido)}\n\n`;

  const textoCodificado = encodeURIComponent(textoMensagem);
    
  let telefone = loja.whatsapp ? loja.whatsapp.replace(/\D/g, '') : '';
    if (telefone && !telefone.startsWith('55')) {
      telefone = `55${telefone}`;
    }

  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${telefone}&text=${textoCodificado}`;





  initialInfo.innerHTML = ` 
    
    <h1>${productSelected.nome}</h1>
    <p id="idProduto" hidden>${productSelected.id}
    <p id="ativo" hidden>${productSelected.ativo}
    <p>Classificação: ${categoria.nome}</p>
    <hr>

    <div class="left-group">
        <span class="promocional-price">${formatMoney(precoExibido)} </span>
        <span class="normal-price">${temPromocao ? formatMoney(productSelected.preco_normal) : ""}</span>
            <div class="metrics-product-merchant">
                <p hidden>${productSelected.views} pessoas já viram</p>
                <p class="forma-de-pagamento" hidden ></p>
            </div>
    </div>

    <div class="right-group">  
        <a class="cta-product" href="${urlWhatsapp}" target="_blank" rel="noopener noreferrer">
            <img src="../assets/icons/whatsapp.png">
            <h8>Tenho Interesse</h8>
        </a>
    </div>

    <div class="description-group ${productSelected.descricao == "" || productSelected.descricao == null ? "hidden":""} ">
      <h4 class="description-title"> Descrição </h4>
      <p class="description">${productSelected.descricao} </p>
    </div>
  `


  
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