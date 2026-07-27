import { API_BASE_URL } from "../api/config.js";
//senha teste 123 -> testando@gmail.com
export async function initLogin() {
    await logar()
}

async function logar() {
    document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const errorMessage = document.getElementById("error-message");
    const errorText = errorMessage.querySelector(".error-text");
    const btnSubmit = document.getElementById("btn-submit");
    const btnText = btnSubmit.querySelector(".btn-text");
    const loader = btnSubmit.querySelector(".loader");

    // 1. Mostrar/Ocultar Senha
    togglePasswordBtn.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        // Opcional: Alterar a opacidade ou o ícone dependendo do estado
        togglePasswordBtn.style.opacity = type === "text" ? "1" : "0.5";
    });

    // 2. Submeter Formulário de Login
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMessage.classList.add("hidden");
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "E-mail ou senha incorretos.");
            }
            // Salva os dados do lojista no localStorage
            if (data.usuario.id) {
                localStorage.setItem("merchant_id", JSON.stringify(data.usuario.id));
            }
            if (data.usuario.loja_id) {
                localStorage.setItem("merchant_loja_id", JSON.stringify(data.usuario.loja_id));
            }
            if (data.usuario.tipo) {
                localStorage.setItem("merchant_tipo", JSON.stringify(data.usuario.tipo));
            }
            // Redireciona para o painel do lojista
            window.location.replace("./home.html");
        } catch (error) {
            errorText.textContent = error.message;
            errorMessage.classList.remove("hidden");
        } finally {
            setLoading(false);
        }
    });

    // Função auxiliar para mudar o estado do botão
    function setLoading(isLoading) {
        if (isLoading) {
            btnSubmit.disabled = true;
            btnText.textContent = "Acessando...";
            loader.classList.remove("hidden");
        } else {
            btnSubmit.disabled = false;
            btnText.textContent = "Entrar no Painel";
            loader.classList.add("hidden");
        }
    }
});    
}