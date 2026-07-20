import { API_BASE_URL } from "../api/config.js"
import { formatDateTime, formatUpdatedAt } from "../utils/formatDate.js"
import { renderMenuAdm } from "../components/renderMenuAdm.js"

export async function initCategorias() {
    const pathParts = window.location.pathname.split("-")
    const id = pathParts[pathParts.length - 1] // pega sempre o ultimo pathParts que é o ID
    await renderCategorias()
    renderMenuAdm()
    btnNewCategoria()

    const btnDelete = document.querySelectorAll(".btn.btn-delete")


    btnDelete.forEach((button) => {
        button.addEventListener("click", async() => {
            const idCategoria = button.dataset.id
            deleteCategoria(idCategoria)
        })
    })

}


function btnNewCategoria() {
    const container = document.querySelector(".newCategoria")
    if (!container) return

    container.innerHTML = `
    <a class="new-product-btn" href="${API_BASE_URL}/adm/categorias/new">Nova Categoria</a>
    `
}
   

export async function renderCategorias() {
    try {
        
        const response = await fetch(`${API_BASE_URL}/api/categorias`); // 1. Aguarda a resposta da requisição HTTP
        const categorias = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".container-clients");
        if (!container) return;

        container.innerHTML = categorias.map((categoria) => createListCategoria(categoria)).join("");
        
    } catch (error) {
        console.error("Erro ao buscar categorias do servidor:", error);
    }

}


function createListCategoria(categoria) {
    const createdAt = formatUpdatedAt(categoria.created_at)
 
    return `
        <tr>
        <td><strong>${categoria.nome}</strong></td>
        <td>${createdAt}</td>
        <td>${categoria.icone_url}</td>
        <td class="text-right">
          <a class="btn btn-view" href="${API_BASE_URL}/adm/categorias/${categoria.id}" >View</a>
           <button class="btn btn-delete" data-id="${categoria.id}">Delete</button>

        </td>

        </td>
      </tr>
      `
}


async function deleteCategoria(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categorias/delete/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            alert("Categoria deletada")
            renderCategorias()

        } catch (error) {
            console.error("Erro ao deletar Categoria", error)
        }
   

}

