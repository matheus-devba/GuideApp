import { products } from "../mocks/produtos_db.js";
import { classificacoes } from "../mocks/classificacoes_db.js";

export function initFormProduto() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const action = params.get("action");

  renderFormProduto(productId, action);
  
  if (productId) {
      fillFormWithProductData(products.find((item) => item.id === productId));
  }

}

function renderFormProduto (productId, action) {
  const container = document.querySelector(".product-page");
  if (!container) return;

  if (productId) {
    const productSelected = products.find((item) => item.id === productId);
    if (!productSelected) return;

    const mediaProduct = document.querySelector('.media-product')
     mediaProduct.innerHTML = `
        <section class="image-product-container">
            <img class="image-product" src=${productSelected.image}>
            <div class="image-upload">
                <input type="file" id="image" name="image" accept="image/*" hidden>
                <label for="image" class="image-upload-label">Alterar Imagem</label>
            </div>
        </section>  
        
    `
    const classificaoesSelect = document.getElementById('classificacoes')
    classificaoesSelect.innerHTML =
    `
    <option>Selecione uma classificação</option>
    ${classificacoes
    .map(
        (classificacao) => `
        <option value="${classificacao.id}">${classificacao.name}</option>
        `
    )
    .join("")}
    `

    const submitButton = document.getElementById('submit-button')
    if (action === 'edit') {
      submitButton.textContent = 'Salvar Alterações'
    } else {
      submitButton.textContent = 'Cadastrar Produto'
    }
    
    } else {
    const mediaProduct = document.querySelector('.media-product')
    mediaProduct.innerHTML = `
      <section class="image-product-container">
          <div class="image-upload">
              <input type="file" id="image" name="image" accept="image/*" hidden>
              <label for="image" class="image-upload-label">Enviar Imagem</label>
          </div>
      </section>  
      
      `
    const classificaoesSelect = document.getElementById('classificacoes')
    classificaoesSelect.innerHTML =
    `
    <option>Selecione uma classificação</option>
    ${classificacoes
    .map(
        (classificacao) => `
        <option value="${classificacao.id}">${classificacao.name}</option>
        `
    )
    .join("")}
    `

    const submitButton = document.getElementById('submit-button')
    if (action === 'edit') {
      submitButton.textContent = 'Salvar Alterações'
    } else {
      submitButton.textContent = 'Cadastrar Produto'
    }
    }


  
}

function fillFormWithProductData(productSelected) {
  const nameInput = document.getElementById('product-name')
  const normalPriceInput = document.getElementById('product-price-normal')
  const promocionalPriceInput = document.getElementById('product-price-promocional')
  const classificaoesSelect = document.getElementById('classificacoes')
  const destaqueOption = document.getElementById('destaqueOption')
  const productDescription = document.getElementById('product-description')

  if (productSelected.description === undefined || productSelected.description === null) {
    productSelected.description = '';
  }

  const classificacao = classificacoes.find((item) => item.id === productSelected.classificacoesId);

  nameInput.value = productSelected.name
  normalPriceInput.value = productSelected.normalPrice
  promocionalPriceInput.value = productSelected.promocionalPrice
  classificaoesSelect.value = classificacao.id
  destaqueOption.value = productSelected.destaque.toString()
  productDescription.value = productSelected.description
}
