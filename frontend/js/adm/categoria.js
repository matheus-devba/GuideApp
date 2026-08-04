import { API_BASE_URL } from "../api/config.js"
import { verificacaoAdm } from "../services/requisicoesAdm.js";
import { renderCategorias } from "./categorias.js"

export async function initCategoria() {

    const pathParts = window.location.pathname.split("/")
    const id = pathParts[pathParts.length - 1] // pega sempre o ultimo pathParts que é o ID
    const verificar = await verificacaoAdm();
    if (!verificar) return; // Se for false (não logado), para a execução aqui.

    await renderCategoria(id)
    await editCategoria(id)
    setImagePreview()

}

async function renderCategoria(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categorias/${id}`)
        const categoriatData = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".client-form")
        if(!container) return

        const innerHTMLCategoria = insertDataCategoria(categoriatData)
        container.innerHTML = innerHTMLCategoria
    } catch (error) {
        console.error("Erro ao busca loja do servidor:", error);
    }

}

function insertDataCategoria(data) {
    return `
         <div class="form-group">
            <label>Nome da Categoria</label>
            <input type="text" id="nome" name="nome" value="${data.nome}">
        </div>

        <div class="form-group">
            <label>Nicho</label>
            <select id="nicho">
                <option></option>
                <!-- Fazer um map com os nichos da tabela -->
                <option value="${data.nicho_id}">${data.nicho_id}</option> 
                <option value="1" id="moda" name="moda">Moda</option> 
                <option value="2" id="cosmeticos" name="cosmeticos">Cosméticos</option>
            </select>
        </div>

        <div class="form-group">
            <label>Icone</label>
            <div class="image-container">
                <input type="file" id="icon-file" name="icon" accept="image/*" hidden>
                <img id="icon_image" class="icon_image" name="icon_image" src="${data.icone_url}">
                <label class="image-upload-label" for="icon-file">Inserir icone</label>
            </div>
        </div>

        <button type="submit" id="submit-button" class="submit-button">Salvar</button>


        
    `
}

function editCategoria(id) {
    const form = document.querySelector("#client-form")
    if (!form) return

   

    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("nome", document.querySelector("#nome").value)
        formData.append("nicho_id", document.querySelector("#nicho").value)


        const iconFile = document.querySelector("#icon-file")?.files[0]

        if (iconFile) formData.append("icon", iconFile)

        try {
            console.log()
            const response = await fetch(`${API_BASE_URL}/api/categorias/update/${id}`, {
                method: "PUT",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const categoria = await response.json()
            alert("categoria atualizada")
            console.log("categoria atualizada", categoria)
            renderCategorias()
            history.back()

        } catch (error) {
            console.error("Erro ao atualizar a categoria", error)
        }

    })

   
    
}



function setImagePreview() {
    const iconInput = document.getElementById("icon-file")
    const iconImage = document.getElementById("icon_image")

    let iconObjectUrl = null

    if (iconInput && iconImage) {
        iconInput.addEventListener("change", () => {
            const file = iconInput.files[0]
            if (!file) return

            if (iconObjectUrl) {
                URL.revokeObjectURL(iconObjectUrl)
            }

            iconObjectUrl = URL.createObjectURL(file)
            iconImage.src= iconObjectUrl
        })
    }

    

}