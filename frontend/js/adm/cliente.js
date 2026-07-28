import { API_BASE_URL } from "../api/config.js"
import { renderClientes } from "./clientes.js"

export async function initCliente() {

    const pathParts = window.location.pathname.split("/")
    const id = pathParts[pathParts.length - 1] // pega sempre o ultimo pathParts que é o ID
    await renderCliente(id)
    await editClient(id)
    setImagePreview()
}

async function renderCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lojas/${id}`)
        const clientData = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".client-form")
        if(!container) return

        const innerHTMLClient =  insertDataClient(clientData)
        container.innerHTML = innerHTMLClient
    } catch (error) {
        console.error("Erro ao busca loja do servidor:", error);
    }

}

 function insertDataClient(data) {

    return `
        <div class="form-group">
            <label>Nome da Loja</label>
            <input type="text" id="store-name" name="store-name" value="${data.nome}">
        </div>

        <div class="form-group">
            <label>Endereço</label>
            <input id="endereco" name="endereco" value="${data.endereco}">
        </div>

        
        <div class="form-group">
            <label>Telefone</label>
            <input id="telefone" name="telefone" value="${data.telefone}">
        </div>

        <div class="form-group">
            <label>Nicho</label>
            <select id="nicho">
                <option value="${data.nicho_id}">${data.nicho_id}</option>
                <option value="1" id="moda" name="moda">Moda</option>
                <option value="2" id="cosmeticos" name="cosmeticos">Cosméticos</option>
            </select>
        </div>

        <div class="form-group">
            <label>Logo</label>
            <div class="image-container">
                <input type="file" id="logo-file" name="image" accept="image/*" hidden>
                <img id="logo_image" class="logo_image" name="logo_image" src="${data.logo_url}">
                <label class="image-upload-label" for="logo-file">Alterar Imagem</label>
            </div>
        </div>

        <div class="form-group">
            <label>Banner</label>
            <div class="image-container">
                <input type="file" id="banner-file" name="image" accept="image/*" hidden>
                <img id="banner_image" class="banner_image" name="logo_image" src="${data.banner_url}">
                <label class="image-upload-label" for="banner-file">Alterar Imagem</label>
            </div>
        </div>

        <div class="form-group">
            <label>Descrição</label>
            <textarea id="descricao" name="descricao">${data.descricao} </textarea>
        </div>

        <div class="form-group">
            <label>WhatsApp</label>
            <input type="tel" id="whatsapp" name="whatsapp" value="${data.whatsapp}">
        </div>

        <div class="form-group">
            <label>Status</label>
            <select id="ativo">
                <option value=${data.ativo} id="ativo" name="ativo">${data.ativo == true ? "Ativo" : "Inativo"}</option>
                <option value=true id="true" name="true">Ativo</option>
                <option value=false id="inativo" name="false">Inativo</option>
            </select>
        </div>

        
        <div class="form-group">
            <label for="rota">Rota</label>
            <input id="rota" name="rota" value="${API_BASE_URL}/lojas/${data.id}" disabled>
        </div>

        <button type="submit" id="submit-button" class="submit-button">Salvar</button>


        
    `
}

function editClient(id) {
    const form = document.querySelector("#client-form")
    if (!form) return

   

    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("nome", document.querySelector("#store-name").value)
        formData.append("endereco", document.querySelector("#endereco").value)
        formData.append("telefone", document.querySelector("#telefone").value)
        formData.append("nicho_id", document.querySelector("#nicho").value)
        formData.append("descricao", document.querySelector("#descricao").value)
        formData.append("whatsapp", document.querySelector("#whatsapp").value)
        formData.append("ativo", document.querySelector("#ativo").value)

        // const payload = {
        //     nome: document.querySelector("#store-name").value,
        //     endereco: document.querySelector("#endereco").value,
        //     telefone: document.querySelector("#telefone").value,
        //     nicho: document.querySelector("#nicho").value,
        //     descricao: document.querySelector("#descricao").value,
        //     whatsapp: document.querySelector("#whatsapp").value,
        //     ativo: document.querySelector("#ativo").value,
        // }

        const logoFile = document.querySelector("#logo-file")?.files[0]
        const bannerFile = document.querySelector("#banner-file")?.files[0]

        if (logoFile) formData.append("logo", logoFile)
        if (bannerFile) formData.append("banner", bannerFile)

        try {
        
            const response = await fetch(`${API_BASE_URL}/api/lojas/update/${id}`, {
                method: "PUT",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const loja = await response.json()
            alert("Loja atualizada")
            console.log("Loja atualizada", loja)
            renderClientes()
            history.back()

        } catch (error) {
            console.error("Erro ao atualizar a loja", error)
        }

    })

   
    
}



function setImagePreview() {
    const logoInput = document.getElementById("logo-file")
    const bannerInput = document.getElementById("banner-file")

    const logoImage = document.getElementById("logo_image")
    const bannerImage = document.getElementById("banner_image")

    let logoObjectUrl = null
    let bannerObjectUrl = null

    if (logoInput && logoImage) {
        logoInput.addEventListener("change", () => {
            const file = logoInput.files[0]
            if (!file) return

            if (logoObjectUrl) {
                URL.revokeObjectURL(logoObjectUrl)
            }

            logoObjectUrl = URL.createObjectURL(file)
            logoImage.src= logoObjectUrl
        })
    }

    if (bannerInput && bannerImage) {
        bannerInput.addEventListener("change", () => {
            const file = bannerInput.files[0]
            if (!file) return

            if (bannerObjectUrl) {
                URL.revokeObjectURL(bannerObjectUrl)
            }

            bannerObjectUrl = URL.createObjectURL(file)
            bannerImage.src = bannerObjectUrl
            
        })
    }



}