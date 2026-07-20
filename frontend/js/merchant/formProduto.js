import { products } from "../mocks/produtos_db.js";
import { classificacoes } from "../mocks/classificacoes_db.js";

// 1. UM ÚNICO ARRAY CONTROLADOR E UM ÚNICO CONTAINER
const mediaProduct = document.querySelector('.list-grid'); 
let imagensDoProduto = []; 

export function initFormProduto() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const action = params.get("action");

  renderFormProduto(productId, action);
  
  if (productId) {
      fillFormWithProductData(products.find((item) => item.id === productId));
  }

  // 2. GERENCIAMENTO DE EVENTOS UNIFICADO
  mediaProduct.addEventListener('change', (e) => {
      if (e.target.id === 'image-input') {
          const files = Array.from(e.target.files);
          const slotsAvailable = 5 - imagensDoProduto.length;
          
          if (slotsAvailable > 0) {
              const filesToAdd = files.slice(0, slotsAvailable);
              // Junta o que já tinha (seja link ou arquivo) com os novos arquivos
              imagensDoProduto = [...imagensDoProduto, ...filesToAdd];
              atualizarGaleriaTela();
          }
      }
  });

  mediaProduct.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete-img')) {
          const indexToRemove = parseInt(e.target.getAttribute('data-index'), 10);
          imagensDoProduto.splice(indexToRemove, 1);
          atualizarGaleriaTela();
      }
  });
}

function renderFormProduto (productId, action) {
  const container = document.querySelector(".product-page");
  if (!container) return;

  // Se tem ID, estamos editando: carrega as fotos antigas do mock/banco
  if (productId) {
    const productSelected = products.find((item) => item.id === productId);
    if (!productSelected) return;

    if (Array.isArray(productSelected.images)) {
      imagensDoProduto = [...productSelected.images];
    } else if (productSelected.image) {
      imagensDoProduto = [productSelected.image];
    }
  } else {
    // Se não tem ID, estamos criando: começa com a galeria vazia
    imagensDoProduto = [];
  }

  // Desenha as imagens na tela (funciona tanto para Criar quanto para Editar)
  atualizarGaleriaTela();

  // Renderiza o select de classificações (removido código duplicado)
  const classificaoesSelect = document.getElementById('classificacoes');
  classificaoesSelect.innerHTML = `
    <option>Selecione uma classificação</option>
    ${classificacoes.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
  `;

  // Define o texto do botão
  const submitButton = document.getElementById('submit-button');
  submitButton.textContent = action === 'edit' ? 'Salvar Alterações' : 'Cadastrar Produto';
}

function fillFormWithProductData(productSelected) {
  if (!productSelected) return;
  
  const nameInput = document.getElementById('product-name')
  const normalPriceInput = document.getElementById('product-price-normal')
  const promocionalPriceInput = document.getElementById('product-price-promocional')
  const classificaoesSelect = document.getElementById('classificacoes')
  const destaqueOption = document.getElementById('destaqueOption')
  const productDescription = document.getElementById('product-description')

  const desc = productSelected.description || '';
  const classificacao = classificacoes.find((item) => item.id === productSelected.classificacoesId);

  nameInput.value = productSelected.name
  normalPriceInput.value = productSelected.normalPrice
  promocionalPriceInput.value = productSelected.promocionalPrice
  if(classificacao) classificaoesSelect.value = classificacao.id
  destaqueOption.value = productSelected.destaque.toString()
  productDescription.value = desc
}

// 3. UMA ÚNICA FUNÇÃO QUE DESENHA A GALERIA DE FORMA INTELIGENTE
function atualizarGaleriaTela() {
  mediaProduct.innerHTML = '';

  // Cria os blocos das imagens atuais
  imagensDoProduto.forEach((imgData, index) => {
      const itemSection = document.createElement('section');
      itemSection.className = 'gallery-item';

      // Se for um arquivo físico de upload novo (objeto File)
      if (imgData instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
              itemSection.innerHTML = `
                  <img src="${e.target.result}" class="gallery-img">
                  <button type="button" class="btn-delete-img" data-index="${index}">&times;</button>
              `;
          };
          reader.readAsDataURL(imgData);
      } else {
          // Se for uma string de URL vinda do mock/banco
          itemSection.innerHTML = `
              <img src="${imgData}" class="gallery-img">
              <button type="button" class="btn-delete-img" data-index="${index}">&times;</button>
          `;
      }
      mediaProduct.appendChild(itemSection);
  });

  // Se tiver menos de 5 imagens no total, adiciona o botão quadrado cinza no final
  if (imagensDoProduto.length < 5) {
      const addBlock = document.createElement('div');
      addBlock.className = 'gallery-add-block';
      addBlock.innerHTML = `
          <input type="file" id="image-input" accept="image/*" multiple hidden>
          <label for="image-input" class="add-block-label">
              <span class="camera-icon">📷</span>
              <span class="add-text">Adicionar fotos e vídeos</span>
          </label>
      `;
      mediaProduct.appendChild(addBlock);
  }
}
