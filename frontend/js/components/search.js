import { products } from "../mocks/produtos_db.js";


export function filterProducts (query, products) {
    const search = normalizeText(query)

    return products.filter((product) => {
        const name = normalizeText(product.name || "")

        return (
            name.includes(search)
        )
    })

}

export function searchRender(query) {
    const awnserProduct = filterProducts(query, products) // Depois posso colocar uma lista específica (ex: hidratantes, perfumes...)

    const container = document.querySelector(".product-list-all");

    container.innerHTML = awnserProduct
    .map(
        (product) => 
        `
        <a class="product-card-all" href="./produto.html?id=${product.id}">
            <img class="product-image-all" src="${product.image}">
            <h2>${product.name}</h2>
            <span class="metrics-product-all">
                <p class="rate">${product.rate}</p>
                <p class="views">${product.view} pessoas já viram</p>
            </span>
            <div class="product-footer-all">
                <div class="price-group-all">
                    <span class="past-price">${product.pastPrice}</span>
                    <span class="current-price">${product.currentPrice}</span>
                </div>
                <button type="button">Ver</button>
            </div>
        </a>
        `).join("")

}

function normalizeText (text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}