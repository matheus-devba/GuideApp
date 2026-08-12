import { eventosDivulgacoes } from "./divulgacoes.js";
// import * as htmlToImage from 'html-to-image';
export async function initDivulgacao() {
    const container = document.querySelector('.render-divulgacao');
    if (!container) return;

    // 1. Busca o HTML salvo na memória do navegador
    const html = localStorage.getItem("divulgacao_html");
    
    if (html) {
        container.innerHTML = html;
        
        aplicarEventoDownload()
       
    } else {
        console.warn("Nenhum HTML de divulgação foi encontrado no localStorage.");
    }
}

function aplicarEventoDownload() {
    const btnDownload = document.querySelector('.cta-download');
    const storyCard = document.querySelector('.story-card');

    if (!btnDownload || !storyCard) return;

    btnDownload.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
        // Gera a imagem em formato PNG preservando o estilo do Story
        const dataUrl = await htmlToImage.toPng(storyCard, {
            quality: 0.95,
            pixelRatio: 2 // Melhora a resolução para Stories (HD)
        });

        // Cria um link temporário para forçar o download
        const link = document.createElement('a');
        link.download = `divulgacao-story-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        } catch (error) {
        console.error('Erro ao gerar a imagem do story:', error);
        }
    });
    }