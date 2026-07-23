import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'

 export async function initLista() {
    const pathParts = window.location.pathname.split("/")
    const id = pathParts[pathParts.length - 1]
    renderLista(id)
    console.log(id)

}

async function renderLista(lista_id) {
    const container = document.querySelector(".product-list-all");
    if (!container) return;

    // Busca os IDs dos produtos vinculados à lista
    const responseIdProdutos = await fetch(`${API_BASE_URL}/api/lista-produtos/lista/${lista_id}`);
    const idProdutos = await responseIdProdutos.json();

    const containerOptions = document.querySelector('.options-group')
 

    // Executa as requisições em paralelo para ficar mais rápido
    const cardsHtml = await Promise.all(
        idProdutos.map(async (item) => {
            // Busca o produto real usando o produto_id vindo da lista
            const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/${item.produto_id}`);
            const product = await responseProdutos.json();

            if (!product) return ""; // Retorna string vazia se o produto não existir

          buttonOptions(product.id)

            // CORREÇÃO: Usa 'product' (dados reais) e não 'item' (apenas IDs)
            return `
                <div class="product-card-item">
                    <a class="product-card-all" href="/produtos/${product.id}">
                        <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
                        <div class="product-info-all">
                          <h2>${product.nome}</h2>
                          <span class="metrics-product-all">
                              <p class="views">${product.views || 0}</p>
                          </span>
                          <div class="product-footer-all">
                              <div class="price-group-all">
                                <span class="promocional-price">R$ ${product.preco_promocional} </span>
                                <span class="normal-price-all">R$ ${product.preco_normal}</span>
                              </div>
                              <button type="button">Ver</button>
                          </div>
                        </div>
                    </a>
                    
                    
                </div>
            `;
        })
    );
    
    // CORREÇÃO: Insere o HTML gerado dentro do container da tela
    container.innerHTML = cardsHtml.join("");

}

function buttonOptions(productId) {
    const container = document.querySelector('.options-group')
    const options = `
            <a class="product-options edit" href="${API_BASE_URL}/produtos/update/${productId}">Editar</a>
            <a class="product-options muted" id="muted" href="#">Ocultar</a>
            <a class="product-options delete" id="delete" href="#">Excluir</a>
    `
    container.innerHTML=options
}