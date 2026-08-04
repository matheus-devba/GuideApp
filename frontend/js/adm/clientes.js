import { API_BASE_URL } from "../api/config.js"
import { formatDateTime, formatUpdatedAt } from "../utils/formatDate.js"
import { renderMenuAdm } from "../components/renderMenuAdm.js"
import { verificacaoAdm } from "../services/requisicoesAdm.js"

export async function initClientes() {
    const pathParts = window.location.pathname.split("-")
    const id = pathParts[pathParts.length - 1] // pega sempre o ultimo pathParts que é o ID
    await renderClientes()
    renderMenuAdm()
    btnNewClient()

    
    const verificar = await verificacaoAdm();
    if (!verificar) return; // Se for false (não logado), para a execução aqui.
    
    const btnHidden = document.querySelectorAll(".btn.btn-hidden")
    const btnActive = document.querySelectorAll(".btn.btn-active")
    
    btnActive.forEach((button) => {
        button.addEventListener("click", async() => {
            const idClient = button.dataset.id
            activeClient(idClient)
        })
    })

    btnHidden.forEach((button) => {
        button.addEventListener("click", async() => {
            const idClient = button.dataset.id
            hiddenClient(idClient)
        })
    })
}


function btnNewClient() {
    const container = document.querySelector(".newClient")
    if (!container) return

    container.innerHTML = `
    <a class="new-product-btn" href="${API_BASE_URL}/adm/clientes/new">Novo Cliente</a>
    `
}
   

export async function renderClientes() {
    try {
        
        const response = await fetch(`${API_BASE_URL}/api/lojas/all`); // 1. Aguarda a resposta da requisição HTTP
        const clientes = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".container-clients");
        if (!container) return;

        container.innerHTML = clientes.map((client) => createListClientes(client)).join("");
        
    } catch (error) {
        console.error("Erro ao buscar lojas do servidor:", error);
    }

}


function createListClientes(client) {
    const createdAt = formatDateTime(client.created_at)
    const updatedAt = formatUpdatedAt(client.updated_at)
 
    return `
        <tr>
        <td><strong>${client.nome}</strong></td>
        <td>${createdAt}</td>
        <td>${updatedAt}</td>
        <td><span class="status ${client.ativo  == true ? `status-active`: `status-inativo` }">${client.ativo == true ? `Ativo` : `Inativo`}</span></td>
        <td><a href="${API_BASE_URL}/lojas/${client.id}?loja_id=${client.id}" style="color: #3b82f6; text-decoration: none;">${API_BASE_URL}/lojas/${client.id}?loja_id=${client.id}</a></td>
        <td class="text-right">
          <a class="btn btn-view" href="${API_BASE_URL}/adm/clientes/${client.id}" >View</a>
           <button class="btn btn-hidden" data-id="${client.id}">Hidden</button>
           <button class="btn btn-active" data-id="${client.id}">Active</button>
           <button class="btn btn-delete">Delete</button>

        </td>
      </tr>
      `
}


async function hiddenClient(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/lojas/hidden/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            alert("Loja ocultada")
            renderClientes()

        } catch (error) {
            console.error("Erro ao ocultar loja", error)
        }
   

}

async function activeClient(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/lojas/active/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            const loja = await response.json()
            alert("Loja ativada")
            console.log("Loja ativada", loja)
            renderClientes()

        } catch (error) {
            console.error("Erro ao ativar a loja", error)
        }
   

}
