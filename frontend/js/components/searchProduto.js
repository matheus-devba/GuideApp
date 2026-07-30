import { API_BASE_URL } from "../api/config.js"
import { formatMoney } from '../utils/formatMoney.js'


export function filterProducts (query, products) {
    const search = normalizeText(query)

    return products.filter((product) => {
        const name = normalizeText(product.nome || "")

        return (
            name.includes(search)
        )
    })

}

export function searchRenderProduct(query, products, loja_id) {
    if (query == "") return

    const awnserProduct = filterProducts(query, products) // Depois posso colocar uma lista específica (ex: hidratantes, perfumes...)

    const container = document.querySelector(".product-list-all");

    if (!awnserProduct || awnserProduct.length === 0) {
        container.innerHTML = "Sem resultados";
    } else {
        container.innerHTML = awnserProduct
    .map(
      (product) => {
        // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
        const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
        
        // Define qual será o preço em destaque
        const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;

        return `
            <a class="product-card-all" href="${API_BASE_URL}/produtos/${product.id}?loja_id=${loja_id}&produto_id=${product.id}">
                <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
                <div class="product-info-all">
                <h2>${product.nome}</h2>
                <span class="metrics-product-all">
                    <img class="eye" src="/assets/icons/eye.png" hidden>
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
        `;
      }
    )
    .join("");

}
}

function normalizeText (text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}