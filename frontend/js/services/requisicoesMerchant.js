import { API_BASE_URL } from "../api/config.js";


export async function verificarUser() {
    const userId = localStorage.getItem("merchant_id");
    const userTipo = localStorage.getItem("merchant_tipo");

    // Se não houver dados de login no localStorage, impede o acesso e redireciona
    if (!userId || !userTipo) {
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
    
    if (!lojaId) {
        window.location.replace(`${API_BASE_URL}/merchant/login`); // Usando URL absoluta do config
        return null;
    }
    return { id: lojaId };
}

export async function getUserId() {
    const userId = localStorage.getItem("merchant_id");
    
    if (!userId) {
        window.location.replace(`${API_BASE_URL}/merchant/login`); // Usando URL absoluta do config
        return null;
    }
    return { id: userId };
}

export async function insertNomeDaLoja(id) {
    const response = await fetch(`${API_BASE_URL}/api/lojas/${id}`);
    const nome = await response.json();

    const storeTitle = document.querySelector('.store-title');
    if (storeTitle) {
        storeTitle.innerHTML = nome.nome;
    }
}

export async function verificacaoUsuario() {
    // 1. Verifica usuário
    const user = await verificarUser();
    if (!user) return false; 

    // 2. Verifica ID da loja
    const lojaId = await getLojaId();
    if (!lojaId) return false;

    // 3. Insere o nome (apenas se o elemento existir na página atual)
    if (document.querySelector('.store-title')) {
        await insertNomeDaLoja(lojaId.id);
    }

    return true; // Retorna true se passou por todas as validações
}