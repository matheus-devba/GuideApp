import { API_BASE_URL } from "../api/config.js"
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'


export async function initLista() {
  const params = new URLSearchParams(window.location.search)
  const loja_id = Number(params.get("loja_id"))
  const list_id = Number(params.get("list_id"))
  await insertNomeDaLoja(loja_id)
  await renderLista(list_id, loja_id);
  selectedProdutos()
}



async function renderLista (list_id, loja_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  const responseLista = await fetch(`${API_BASE_URL}/api/listas/${list_id}`)
  const lista = await responseLista.json()

  const responseListaProduto = await fetch(`${API_BASE_URL}/api/lista-produtos/lista/${list_id}`)
  const listaProduto = await responseListaProduto.json()

  if (!lista || !listaProduto) return;

  const titleList = document.querySelector(".sections-title")
  titleList.innerHTML = lista.nome

 // 1) Busca IDs dos itens da lista
  const responseIdProdutos = await fetch(`${API_BASE_URL}/api/lista-produtos/lista/${list_id}`);
  const idProdutos = await responseIdProdutos.json();

  // 2) Busca dados reais de cada produto
  const cardsHtml = await Promise.all(
    idProdutos.map(async (item) => {
      const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/${item.produto_id}`);
      const product = await responseProdutos.json();

      if (!product) return "";

            // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
      const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
      
      // Define qual será o preço em destaque
      const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

      return `
        <div class="product-card-item">
          <a class="product-card-all"href="${API_BASE_URL}/produtos/${product.id}?loja_id=${loja_id}&produto_id=${product.id}"">
          <input 
            type="checkbox" 
            class="selectProduct"
            value = "${product.nome} no valor de ${formatMoney(precoExibido)}"
          >
            <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
            <div class="product-info-all">
                <h2>${product.nome}</h2>
                <span class="metrics-product-all">
                    <img class="eye" hidden src="../assets/icons/eye.png">
                    <p class="views" hidden>${product.views}</p>
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
        </div>
      `;
    })
  );

  container.innerHTML = cardsHtml.join("");
  
}


function selectedProdutos() {
  const inputsProdutos = document.querySelectorAll('.selectProduct');
  if (!inputsProdutos) return

  let selecaoDeProdutos = []

  inputsProdutos.forEach((selectIndividual) => {
    selectIndividual.addEventListener("change", (event) => {
    const produto = event.target.value; 
    const marcados = Array.from(inputsProdutos).filter(checkbox => checkbox.checked);
    selecaoDeProdutos = marcados.map(checkbox => checkbox.value);
    })
  })

  return selecaoDeProdutos
 
}
