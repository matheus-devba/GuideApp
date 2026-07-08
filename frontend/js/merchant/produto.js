import { products } from "../mocks/produtos_db.js";

export function initProduto() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  renderProduto(productId);
  mutedItem()
  deleteItem()
  
}


export function renderProduto (productId) {
  const container = document.querySelector(".product-page");
  if (!container) return;

  const productSelected = products.find((item) => item.id === productId);
  if (!productSelected) return;

  const mediaProduct = document.querySelector('.media-product')
  mediaProduct.innerHTML = `<img class="image-product" src=${productSelected.image} >`

  const initialInfo = document.querySelector('.initial-info')
  initialInfo.innerHTML = ` 
    
    <h1>${productSelected.name}</h1>
    <label>Classificação: Perfumes</label>
    <hr>

    <div class="left-group">
        <span class="promocional-price">R$ ${productSelected.promocionalPrice} </span>
        <span class="normal-price">R$ ${productSelected.normalPrice}</span>
            <div class="metrics-product-merchant">
                <p>${productSelected.rate}</p>
                <p>${productSelected.view} pessoas já viram</p>
                <p>${productSelected.interested} pessoas estão interessadas</p>
            </div>
    </div>

    <div class="options-group">  
      <a class="product-options edit" href="./formProduto.html?id=${productSelected.id}&action=edit">Editar</a>
      <a class="product-options muted" id="muted" href="#">Ocultar</a>
      <a class="product-options delete" id="delete" href="#">Excluir</a>
    </div>
  `
}



function mutedItem () {
  const muted = document.getElementById('muted')

  muted.addEventListener('click', (e) => {
    e.preventDefault()
    if (muted.className === 'product-options activate') {
      alert('Produto ativado com sucesso!')
      muted.textContent = 'Ocultar Produto'
      muted.className = 'product-options muted'
      return
    }
    const confirmAction = prompt('Deseja realmente ocultar este produto? (Digite "sim" para confirmar)').toLowerCase()
    if (confirmAction === "sim") {
      alert('Produto ocultado com sucesso!')
      muted.textContent = 'Ativar Produto'
      muted.className = 'product-options activate'
    }
  })
}

function deleteItem () {
  const deleteBtn = document.getElementById('delete')
  
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const confirmAction = prompt('Deseja realmente excluir este produto? (Digite "sim" para confirmar)').toLowerCase()
    if (confirmAction === "sim") {
      alert('Produto excluído com sucesso!')
      window.location.href = './produtos.html'
    }
  })
}