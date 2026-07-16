import { API_BASE_URL } from "../api/config.js"


export async function initCliente() {

    const pathParts = window.location.pathname.split("/")
    const id = pathParts[pathParts.length - 1] // pega sempre o ultimo pathParts que é o ID
    await renderCliente(id)
    await hiddenClient(id)
}

async function renderCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lojas/${id}`)
        const clientData = await response.json();// 2. Aguarda a conversão da resposta para um Objeto/Array JavaScript

        const container = document.querySelector(".client-form")
        if(!container) return

        const innerHTMLClient = insertDataClient(clientData)
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
            <select>
                <option value="${data.nicho}">${data.nicho}</option>
                <option value="Moda" id="moda" name="moda">Moda</option>
                <option value="Cosméticos" id="cosmeticos" name="cosmeticos">Cosméticos</option>
            </select>
        </div>

        <div class="form-group">
            <label>Logo</label>
            <div class="image-container">
                <input type="file" id="image" name="image" accept="image/*" hidden>
                <img id="logo_image" class="logo_image" name="logo_image" src="${data.logo_url}">
                <label class="image-upload-label">Alterar Imagem</label>
            </div>
        </div>

        <div class="form-group">
            <label>Banner</label>
            <div class="image-container">
                <input type="file" id="image" name="image" accept="image/*" hidden>
                <img id="banner_image" class="banner_image" name="logo_image" src="${data.banner_url}">
                <label class="image-upload-label">Alterar Imagem</label>
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
            <select>
                <option value="${data.ativo}" id="ativo" name="ativo">${data.ativo}</option>
                <option value="ativo" id="ativo" name="ativo">Ativo</option>
                <option value="inativo" id="inativo" name="inativo">Inativo</option>
            </select>
        </div>

        
        <div class="form-group">
            <label for="rota">Rota</label>
            <input id="rota" name="rota" value="${API_BASE_URL}/lojas/${data.id}">
        </div>

        <button type="submit" id="submit-button" class="submit-button">Salvar</button>


        
    `
}

