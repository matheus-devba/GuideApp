import { API_BASE_URL } from "../api/config.js";


export async function verificarUser() {
    const userId = localStorage.getItem("merchant_id");
    const userTipo = localStorage.getItem("merchant_tipo");
    
    // Se não houver dados de login no localStorage, impede o acesso e redireciona
   
    if (!userId || userTipo == '"user"') {
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

export async function getUserId() {
    const userId = localStorage.getItem("merchant_id");
    
    if (!userId) {
        window.location.replace(`${API_BASE_URL}/merchant/login`); // Usando URL absoluta do config
        return null;
    }
    return { id: userId };
}


export async function verificacaoAdm() {
    // 1. Verifica usuário
    const user = await verificarUser();
    if (!user || user.tipo == '"user"') return false; 
   

    return true; // Retorna true se passou por todas as validações
}