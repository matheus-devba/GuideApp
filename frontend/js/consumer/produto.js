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
    <h7>Mary Boutique</h7>
    <h1>${productSelected.name}</h1>
    <label>Novidade!</label>
    <hr>

    <div class="left-group">
      <span class="promocional-price">R$ ${productSelected.promocionalPrice} </span>
      <span class="normal-price">R$ ${productSelected.normalPrice}</span>
        <div class="metrics-product">
            <p class="rate">${productSelected.rate}</p>
            <p class="views">${productSelected.view}</p>
            <p class="forma-de-pagamento">Em até 2x sem juros</p>
        </div>
    </div>

    <div class="right-group">  
        <a class="cta-product" href="https://api.whatsapp.com/send?phone=5575983384725&text=Ol%C3%A1%20%F0%9F%98%8D!%20Vim%20do%20Guide%20e%20tenho%20interesse%20no%20produto%20**${productSelected.name}**%20no%20valor%20de%20R%24${productSelected.promocionalPrice}"> 
            <img src="../assets/icons/whatsapp.png">
            <h8>Tenho Interesse</h8>
        </a>
    </div>
    <h4 class="description-title"> Descrição </h4>
    <p class="description">${productSelected.description} </p>
  `


  
}
