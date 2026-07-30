import { API_BASE_URL } from "../api/config.js"
import { popupMessage, popupConfirm } from "./popup.js";


export async function btnShare(rota, title, text) {
    const container = document.querySelector('.top-icon-btn.share');
    if (!container) return; // Proteção caso o botão não exista na página

    // Monta a URL completa que será compartilhada
    const urlParaCompartilhar = `${API_BASE_URL}${rota}`;

    // Altera o HTML inserindo a imagem de forma limpa
    container.innerHTML = ` 
        <img class="top-icon" src="/assets/icons/share.png" alt="Compartilhar">
    `;

    // Remove ouvintes antigos (boa prática para evitar cliques duplicados)
    const novoBotao = container.cloneNode(true);
    container.parentNode.replaceChild(novoBotao, container);

    // Adiciona o evento de clique para abrir o compartilhamento nativo
    novoBotao.addEventListener("click", async (e) => {
        e.preventDefault();

        // Verifica se o navegador/dispositivo suporta o compartilhamento nativo
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: urlParaCompartilhar // Link completo gerado dinamicamente
                });
                console.log('Compartilhado com sucesso!');
            } catch (error) {
                console.log('Compartilhamento cancelado ou falhou:', error);
            }
        } else {
            // Fallback: Se o dispositivo não suportar (como navegadores antigos de PC), copia para a área de transferência
            try {
                await navigator.clipboard.writeText(urlParaCompartilhar);
                popupMessage({
                    titulo: "Sucesso!",
                    mensagem: "Link copiado para a área de transferência!"
                     });
            } catch (err) {
                popupMessage({
                    titulo: "Opa! Não foi possível copiar automaticamente.",
                    mensagem: `Copie o link: ${urlParaCompartilhar}`
                     })
            }
        }
    });
}