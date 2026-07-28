import { API_BASE_URL } from "../api/config.js";



export async function getLojaId() {
    const lojaId = localStorage.getItem("merchant_loja_id");
    
    if (!lojaId) {
        window.location.replace(`${API_BASE_URL}/merchant/login`); // Usando URL absoluta do config
        return null;
    }
    return { id: lojaId };
}

export async function insertNomeDaLoja(id) {
    const response = await fetch(`${API_BASE_URL}/api/lojas/${id}`);
    const nome = await response.json();

    const storeTitle = document.querySelector('.store-title');
    if (storeTitle) {
        storeTitle.innerHTML = nome.nome;
    }
}

