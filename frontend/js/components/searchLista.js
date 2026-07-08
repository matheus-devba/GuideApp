import { lists } from "../mocks/listas_db.js"


export function filterLists (query) {
    const search = normalizeText(query)

    return lists.filter((list) => {
        const name = normalizeText(list.title || "")

        return (
            name.includes(search)
        )
    })

}

export function searchRenderLists(query, linkPrefix) {
    const awnserList = filterLists(query, lists) // Depois posso colocar uma lista específica (ex: hidratantes, perfumes...)

    const container = document.querySelector(".product-list-all");

    container.innerHTML = awnserList
    .map(
        (list) => 
`
        <a class="list-product-card" href="${linkPrefix}${list.id}">
          <div class="list-card-images">
            <img src="${list.imageBack}" class="list-image back">
            <img src="${list.imageFront}" class="list-image front">
            <span class="badge">${list.badge}</span>
          </div>
          <div class="list-content">
            <h4>${list.title}</h4>
            <p>${list.count}</p>
            <span class="metric"> 
              <img src="../assets/icons/eye.png" class="metric-icon">
              <p class="metric-text">${list.metricTitle} visualizações</p>
            </span>
          
          </div>
        </a>
      `).join("")

}

function normalizeText (text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}