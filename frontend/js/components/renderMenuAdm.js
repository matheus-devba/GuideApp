import { API_BASE_URL } from "../api/config.js"


export function renderMenuAdm() {
    const container = document.querySelector(".group-menu")
    if (!container) return

    container.innerHTML = `
        <a class="selected-item" href="./home.html">Home</a>
        <a class="menu-item" href="${API_BASE_URL}/adm/clientes">Clientes</a>
        <a class="menu-item" href="${API_BASE_URL}/adm/categorias">Categorias</a>
        <a class="menu-item" href="${API_BASE_URL}/adm/usuarios">Usuarios</a>
        <a class="menu-item" href="./configuracoes.html">Configurações</a>
    `
           
   
}