import { API_BASE_URL } from "../api/config.js"
import { getLojaId, insertNomeDaLoja, verificarUser } from "../services/requisicoesMerchant.js";
import { formatMoney } from '../utils/formatMoney.js'


export async function initProduto() {
  const pathParts = window.location.pathname.split("/")
  const id = pathParts[pathParts.length - 1]

  // 1. Executa a verificação inicial do usuário logado
  const user = await verificarUser();
  // Se não estiver logado, a função acima redireciona para o login e nós encerramos a execução aqui
  if (!user) return; 

  const lojaId = await getLojaId()

  await insertNomeDaLoja(lojaId.id)

  await renderProduto(id);
  alternarStatusProduto()
  deleteItem()

}


export async function renderProduto (productId) {
  const container = document.querySelector(".product-page");
  if (!container) return;

  const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/${productId}`);
  const productSelected = await responseProdutos.json();

  if (!productSelected) return;

  const categoriaId = productSelected.categoria_id

  const responseCategoria = await fetch(`${API_BASE_URL}/api/categorias/${categoriaId}`);
  const categorias = await responseCategoria.json();

  const responseImagens = await fetch(`${API_BASE_URL}/api/produto_imagens/buscar_imagens/${productId}`)
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
  initialInfo.innerHTML = ` 
    
    <h1>${productSelected.nome}</h1>
    <p id="idProduto" hidden>${productSelected.id}
    <p id="ativo" hidden>${productSelected.ativo}
    <label>Classificação: ${categorias.nome}</label>
    <hr>

    <div class="left-group">
        <span class="promocional-price">${formatMoney(productSelected.preco_promocional)} </span>
        <span class="normal-price">${formatMoney(productSelected.preco_normal)}</span>
            <div class="metrics-product-merchant">
                <p>${productSelected.views} pessoas já viram</p>
                
            </div>
    </div>

    <div class="options-group">  
      <a class="product-options edit" href="${API_BASE_URL}/produtos/update/${productSelected.id}">Editar</a>
      <a class="product-options muted" id="muted" href="#">Ocultar</a>
      <a class="product-options delete" id="delete" href="#">Excluir</a>
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



async function alternarStatusProduto() {
  const btnMuted = document.getElementById('muted'); //botao para status
  const idProdutoElement = document.getElementById('idProduto');
  
  if (!btnMuted || !idProdutoElement) return;

  const idProduto = idProdutoElement.value || idProdutoElement.textContent;

  btnMuted.addEventListener('click', async (e) => {
    e.preventDefault();

    // Verifica se o botão tem a classe 'activate' (significa que o produto está oculto e o usuário quer ATIVAR)
    const querAtivar = btnMuted.classList.contains('activate');
    
    // Define a URL baseada na ação atual
    const url = querAtivar 
      ? `${API_BASE_URL}/api/produtos/active/${idProduto}`
      : `${API_BASE_URL}/api/produtos/hidden/${idProduto}`;

    // Se for para ocultar, pede a confirmação por segurança
    if (!querAtivar) {
      const confirmAction = prompt('Deseja realmente ocultar este produto? (Digite "sim" para confirmar)');
      if (!confirmAction || confirmAction.toLowerCase() !== "sim") return;
    }

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Atualiza o visual do botão dependendo do sucesso da ação realizada
      if (querAtivar) {
        alert('Produto ativado com sucesso!');
        btnMuted.textContent = 'Ocultar Produto';
        btnMuted.className = 'product-options muted';
      } else {
        alert('Produto oculto com sucesso!');
        btnMuted.textContent = 'Ativar Produto';
        btnMuted.className = 'product-options activate';
      }

    } catch (error) {
      console.error(`Erro ao processar requisição (${url}):`, error);
      alert('Não foi possível alterar o status do produto.');
    }
  });
}

 

async function deleteItem() {
  const deleteBtn = document.getElementById('delete');
  const idProdutoElement = document.getElementById('idProduto');
  
  if (!deleteBtn || !idProdutoElement) return; // Proteção caso os elementos não existam na página

  const idProduto = idProdutoElement.value || idProdutoElement.textContent;

  deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const confirmAction = prompt('Deseja realmente excluir este produto? (Digite "sim" para confirmar)');
    
    if (confirmAction && confirmAction.toLowerCase() === "sim") {
      try {
        const response = await fetch(`${API_BASE_URL}/api/produtos/delete/${idProduto}`, {
          method: "DELETE", // Envia o método correto de exclusão para a API
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        alert('Produto excluído com sucesso!');
        window.location.href = './produtos.html'; // Redireciona apenas após o sucesso no banco
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert('Não foi possível excluir o produto. Tente novamente mais tarde.');
      }
    }
  });
}
