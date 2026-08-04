
import { API_BASE_URL } from "../api/config.js"
import { verificacaoAdm } from "../services/requisicoesAdm.js";
import { renderUsuarios } from "./usuarios.js"

export async function initUsuario() {
const pathParts = window.location.pathname.split("/")
    const id = pathParts[pathParts.length - 1] // pega sempre o ultimo pathParts que é o ID

    const verificar = await verificacaoAdm();
    if (!verificar) return; // Se for false (não logado), para a execução aqui.

    await renderUsuario(id)
    await editClient(id)
    console.log('rw')
}



async function renderUsuario(id) {
  const container = document.querySelector(".usuario-form");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`);

    const usuarioData = await response.json();


    const html = await insertDataUsuario(usuarioData);
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<p>Falha ao carregar usuário.</p>`;
    console.error("Erro ao buscar usuário do servidor:", error);
  }
}

async function insertDataUsuario(data) {
    console.log(data)
    let nomeDaLoja = "";

    try {
        const response = await fetch(`${API_BASE_URL}/api/lojas/${data.loja_id}`);
        if (response.ok) {
            const loja = await response.json();
            // Acessa a propriedade '.nome' (ou o nome correto do campo na sua API)
            nomeDaLoja = loja.nome || "Guide"; 
        }
    } catch (error) {
        console.error("Erro ao buscar usuario:", error);
    }

    return `
        <div class="form-group">
            <label for="store-name">Nome da Loja</label>
            <input type="hidden" id="loja_id" name="loja_id" value="${data.loja_id}">
            <input type="text" id="store-name" name="store-name" value="${nomeDaLoja}" disabled>
        </div>

        <div class="form-group">
            <label>Nome do Usuario</label>
            <input type="text" id="nome-usuario" name="nome-usuario" value="${data.nome}">
        </div>

        <div class="form-group">
            <label>E-mail</label>
            <input id="email" name="email" value="${data.email}">
        </div>


        <div class="form-group">
            <label>Tipo</label>
            <select id="tipo">
                <option value="${data.tipo}">${data.tipo}</option>
                <option value="user" id="user" name="user">user</option>
                <option value="adm" id="adm" name="adm">adm</option>
            </select>
        </div>

        <div class="form-group">
            <label>Status</label>
            <select id="ativo">
                <option value=${data.ativo} id="ativo" name="ativo">${data.ativo == true ? "Ativo" : "Inativo"}</option>
                <option value=true id="true" name="true">Ativo</option>
                <option value=false id="inativo" name="false">Inativo</option>
            </select>
        </div>

    <button type="submit" id="submit-button" class="submit-button">Salvar</button>

 `
}

async function editClient(id) {
    const form = document.querySelector("#usuario-form")
    if (!form) return

   

    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const payload = {
            loja_id: Number(document.querySelector("#loja_id")).value, 
            nome: document.querySelector("#nome-usuario").value,
            email: document.querySelector("#email").value,
            tipo: document.querySelector("#tipo").value,
            ativo: document.querySelector("#ativo").value === "true" 
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dados: payload }) // ou apenas payload, se ajustar controller
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const usuario = await response.json()
            alert("usuario atualizada")
            console.log("usuario atualizada", usuario)
            await renderUsuarios()
            window.location.href = `${API_BASE_URL}/adm/usuarios`

        } catch (error) {
            console.error("Erro ao atualizar a usuario", error)
        }

    })

   
    
}



