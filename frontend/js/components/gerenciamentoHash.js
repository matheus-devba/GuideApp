import { API_BASE_URL } from "../api/config.js"


// Função no frontend para pedir ao backend que crie o hash
export async function pedirHashAoBackend(senhaDigitada) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/usuarios/gerar-hash`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senha: senhaDigitada }) // Envia a senha para o servidor
        });

        const dados = await response.json();
        return dados.hash; // Retorna o hash que o backend gerou
    } catch (error) {
        console.error('Erro ao comunicar com o backend:', error);
    }
}

// === EXEMPLO DE USO NO FRONTEND ===
async function salvarUsuario() {
    const senhaDoFormulario = "MinhaSenha123";
    
    // Chama a função que faz o fetch
    const hashPronto = await pedirHashAoBackend(senhaDoFormulario);
    
    console.log("O hash devolvido pelo backend é:", hashPronto);
    // Agora você pode usar esse hash para continuar o seu processo
}
