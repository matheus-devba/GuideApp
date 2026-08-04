import { API_BASE_URL } from "../api/config.js"
import { renderUsuarios } from "./usuarios.js"
import { pedirHashAoBackend } from "../components/gerenciamentoHash.js"
import { verificacaoAdm } from "../services/requisicoesAdm.js";


export async function initNewAdm() {
const verificar = await verificacaoAdm();
if (!verificar) return; // Se for false (não logado), para a execução aqui.

 createAdm()
}

async function createAdm() {
    const form = document.querySelector("#usuario-form")
    if (!form) return


    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const senhaInput = document.querySelector("#senha")
        const senha = senhaInput?.value?.trim()

        if (!senha) {
          alert("Informe uma senha")
        return
        }

        const hash = await pedirHashAoBackend(senha)

        if (!hash) {
            alert("Não foi possível gerar o hash da senha")
            return
        }

        const payload = {
            nome: document.querySelector("#nome-usuario").value,
            email: document.querySelector("#email").value,
            password_hash: hash,
            tipo: document.querySelector("#tipo").value,
            ativo: document.querySelector("#ativo").value === "true" 
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/root/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload) // ou apenas payload, se ajustar controller
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const usuario = await response.json()
            alert("usuario criado")
            console.log("usuario criado", usuario)
            await renderUsuarios()
            window.location.href = `${API_BASE_URL}/adm/usuarios`

        } catch (error) {
            console.error("Erro ao atualizar a usuario", error)
        }
    })

   
}

export async function initNewUsuario()  {
     await createUsuario()
}

async function createUsuario() {
    const form = document.querySelector("#usuario-form")
    if (!form) return

    carregarSelectDeLojas()


    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const senhaInput = document.querySelector("#senha")
        const senha = senhaInput?.value?.trim()

        if (!senha) {
          alert("Informe uma senha")
        return
        }

        const hash = await pedirHashAoBackend(senha)

        if (!hash) {
            alert("Não foi possível gerar o hash da senha")
            return
        }

        const payload = {
            loja_id: document.querySelector("#loja_id").value, 
            nome: document.querySelector("#nome-usuario").value,
            email: document.querySelector("#email").value,
            password_hash: hash,
            tipo: document.querySelector("#tipo").value,
            ativo: document.querySelector("#ativo").value === "true" 
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload) // ou apenas payload, se ajustar controller
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const usuario = await response.json()
            alert("usuario criado")
            console.log("usuario criado", usuario)
            await renderUsuarios()
            window.location.href = `${API_BASE_URL}/adm/usuarios`

        } catch (error) {
            console.error("Erro ao atualizar a usuario", error)
        }
    })

   
    
}


async function carregarSelectDeLojas(lojaIdSelecionada = null) {
    try {
        // 1. Busca todas as lojas cadastradas na sua API
        const response = await fetch(`${API_BASE_URL}/api/lojas`);
        const lojas = await response.json();

        const selectLoja = document.querySelector("#loja_id");

        // 2. Mapeia o array de lojas transformando-o em várias tags <option>
        const opcoesHtml = lojas.map(loja => {
            // Se o ID da loja for o mesmo que o usuário já tem salvo, ela vem pré-selecionada
            const isSelected = loja.id === lojaIdSelecionada ? 'selected' : '';
            return `<option value="${loja.id}" ${isSelected}>${loja.nome}</option>`;
        }).join('');

        // 3. Insere as opções dentro do select (mantendo a opção padrão no topo)
        selectLoja.innerHTML = `
            <option value="" disabled ${!lojaIdSelecionada ? 'selected' : ''}>Escolha uma loja...</option>
            ${opcoesHtml}
        `;
    } catch (error) {
        console.error("Erro ao carregar lista de lojas:", error);
    }
}


