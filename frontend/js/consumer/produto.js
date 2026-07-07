import { products } from "../mocks/produtos_db.js";

export function initProduto() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  renderProduto(productId);
  
}


function renderProduto (productId) {
  const container = document.querySelector(".product-page");
  if (!container) return;

  const productSelected = products.find((item) => item.id === productId);
  if (!productSelected) return;

  const mediaProduct = document.querySelector('.media-product')
  mediaProduct.innerHTML = `<img class="image-product" src=${productSelected.image} >`

  const initialInfo = document.querySelector('.initial-info')
  initialInfo.innerHTML = ` 
    <h7>Perfumaria Store</h7>
    <h1>${productSelected.name}</h1>
    <label>Preço verificado há 3 horas</label>
    <hr>

    <div class="left-group">
        <span>${productSelected.currentPrice}</span>
        <span class="past-price">${productSelected.pastPrice}</span>
            <div class="metrics-product">
                <p class="rate">${productSelected.rate}</p>
                <p class="views">${productSelected.view} pessoas já viram</p>
            </div>
    </div>

    <div class="right-group">  
        <a class="cta-product" href="/frontend/consumer/loja.html"> 
            <img src="../assets/icons/whatsapp.png">
            <h8>Tenho Interesse</h8>
        </a>
    </div>
  `


  
}
