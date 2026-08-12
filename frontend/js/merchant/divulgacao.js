import { eventosDivulgacoes } from "./divulgacoes.js";

export async function initDivulgacao() {
    const container = document.querySelector('.render-divulgacao');
    if (!container) return;

    // 1. Busca o HTML salvo na memória do navegador
    const html = localStorage.getItem("divulgacao_html");
    
    if (html) {
        container.innerHTML = html;
    } else {
        console.warn("Nenhum HTML de divulgação foi encontrado no localStorage.");
    }
}