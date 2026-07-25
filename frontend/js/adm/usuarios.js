import { API_BASE_URL } from "../api/config.js"
import { renderMenuAdm } from "../components/renderMenuAdm.js"
import { formatDateTime, formatUpdatedAt } from "../utils/formatDate.js"



export async function initUsuarios() {
    await renderMenuAdm()
    await renderUsuarios()
    btnNewUser()
    const btnDelete = document.querySelectorAll(".btn.btn-delete")
    
    btnDelete.forEach((button) => {
        button.addEventListener("click", async() => {
            const idClient = button.dataset.id
            deleteUsuario(idClient)
        })
    })

}

function btnNewUser() {
    const container = document.querySelector(".newUser")
    if (!container) return

    container.innerHTML = `
    <a class="new-product-btn" href="${API_BASE_URL}/adm/usuarios/new">Novo Usuario</a>
    <a class="new-product-btn" href="${API_BASE_URL}/adm/root/new">Novo Adm</a>
    `
}

export async function renderUsuarios() {
    try {
        
        const response = await fetch(`${API_BASE_URL}/api/usuarios`); // 1. Aguarda a resposta da requisição HTTP
        const usuarios = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".container-users");
        if (!container) return;

        const promises = usuarios.map(usuario => createListUsuarios(usuario));
        const linhasHtml = await Promise.all(promises);

        container.innerHTML = linhasHtml
        
    } catch (error) {
        console.error("Erro ao buscar usuarios do servidor:", error);
    }

}


async function createListUsuarios(usuario) {
    const createdAt = formatUpdatedAt(usuario.created_at);

    let nomeDaLoja = "";
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/lojas/${usuario.loja_id}`);
        if (response.ok) {
            const loja = await response.json();
            // Acessa a propriedade '.nome' (ou o nome correto do campo na sua API)
            nomeDaLoja = loja.nome || "Guide"; 
        }
    } catch (error) {
        console.error("Erro ao buscar loja:", error);
    }

    return `
      <tr>
        <td><strong>${usuario.nome}</strong></td>
        <td>${nomeDaLoja}</td>
        <td>${usuario.tipo}</td>
        <td>${createdAt}</td>
        <td>${usuario.ativo ? "Ativo" : "Inativo"}</td> <!-- Melhora a exibição do boolean -->
        <td class="text-right">
          <a class="btn btn-view" href="${API_BASE_URL}/adm/usuarios/${usuario.id}">View</a>
          <button class="btn btn-delete" data-id="${usuario.id}">Delete</button>
        </td>
      </tr>
    `;
}

async function deleteUsuario(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/delete/${id}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            alert("usuario deletado")
            renderUsuarios()

        } catch (error) {
            console.error("Erro ao ocultar usuario", error)
        }
   

}
