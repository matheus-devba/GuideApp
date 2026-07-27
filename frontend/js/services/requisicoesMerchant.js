import { API_BASE_URL } from "../api/config.js";


export async function verificarUser() {
    const userId = localStorage.getItem("merchant_id");
    const userTipo = localStorage.getItem("merchant_tipo");
    // Se não houver dados de login no localStorage, impede o acesso e redireciona
    if (!userId && !userTipo) {
        window.location.replace(`${API_BASE_URL}/merchant/login`);
        return null;
    }
    try {
        return { id: userId, tipo: userTipo };
    } catch (error) {
        console.error("Erro ao ler dados de autenticação:", error);
        window.location.replace("./login.html");
        return null;
    }
}

export async function getLojaId() {
    const lojaId = localStorage.getItem("merchant_loja_id");
    // Se não houver dados de login no localStorage, impede o acesso e redireciona
    if (!lojaId) {
        window.location.replace("./login.html");
        return null;
    }
    try {
        return { id: lojaId };
    } catch (error) {
        console.error("Erro ao ler dados de autenticação:", error);
        window.location.replace("./login.html");
        return null;
    }
}

export async function insertNomeDaLoja(id) {
    const response = await fetch(`${API_BASE_URL}/api/lojas/${id}`)
    const nome = await response.json()

    document.querySelector('.store-title').innerHTML = nome.nome
}