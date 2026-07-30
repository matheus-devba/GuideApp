import { API_BASE_URL } from "../api/config.js";






export async function insertNomeDaLoja(id) {
    const response = await fetch(`${API_BASE_URL}/api/lojas/${id}`);
    const nome = await response.json();

    const storeTitle = document.querySelector('.store-title');
    if (storeTitle) {
        storeTitle.innerHTML = nome.nome;
    }
}

