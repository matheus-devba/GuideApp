import { API_BASE_URL } from "../api/config.js"
import { formatDateTime } from "../utils/formatDate.js"

export function initClientes() {
renderClientes()

}

async function renderClientes() {
    try {
        
        const response = await fetch(`${API_BASE_URL}/api/lojas`); // 1. Aguarda a resposta da requisição HTTP
        const clientes = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".container-clients");
        if (!container) return;

        console.log(clientes)
        container.innerHTML = clientes.map((client) => createListClientes(client)).join("");
        
    } catch (error) {
        console.error("Erro ao buscar lojas do servidor:", error);
    }




}



function createListClientes(client) {
    const createdAt = formatDateTime(client.created_at)
    const updatedAt = formatDateTime(client.updatedAt)
 
    return `
        <tr>
        <td><strong>${client.nome}</strong></td>
        <td>${createdAt}</td>
        <td>${updatedAt}</td>
        <td><span class="status ${client.ativo  == true ? `status-active`: "" } s">${client.ativo == true ? `Ativo` : `Não ativo`}</span></td>
        <td><a href="#" style="color: #3b82f6; text-decoration: none;">${API_BASE_URL}/adm/clientes/${client.id}</a></td>
        <td class="text-right">
          <a class="btn btn-view" href="${API_BASE_URL}/adm/clientes/${client.id}" >View</a>
           <button class="btn btn-hidden">Hidden</button>
           <button class="btn btn-delete">Delete</button>

        </td>
      </tr>
      `
}