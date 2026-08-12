import { popupMessage } from "../components/popup.js";
import { eventosDivulgacoes } from "./divulgacoes.js";

export async function initDivulgacao() {
    const container = document.querySelector('.render-divulgacao');
    if (!container) return;

    // 1. Busca o HTML salvo na memória do navegador
    const html = localStorage.getItem("divulgacao_html");
    // console.log(html)

    // let html = `
    //         <div class="story-card">
    //             <!-- Cabeçalho da Loja -->
    //             <div class="header-loja">
    //                 <img src="https://vodetbuknsfmkliasvkr.supabase.co/storage/v1/object/public/lojas/logos/logo-1785772818885-431919409.png" class="logo-loja" alt="Logo">
    //                 <h1 class="nome-loja">Mary Boutique</h1>
    //             </div>

    //             <!-- Conteúdo de Texto -->
    //             <div class="content-divulgacao">
    //                 <h2 class="titulo-divulgacao">Seleção Especial Esperando por Você</h2>
    //                 <p class="descricao-divulgacao">Acesse o link e veja a lista completa que preparamos no Guide.</p>
    //             </div>
                

    //             <!-- Grid com os 2 Cards Padronizados -->
    //             <section class="listas-grid-story">
                    
    //             <a class="list-product-card" href="http://localhost:3000/listas/merchant/5">
    //             <div class="list-card-images">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/26" class="list-image back">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/25" class="list-image front">
    //                 <span class="badge">+2</span>
    //             </div>
    //             <div class="list-content">
    //                 <h4>ta</h4>
    //                 <p class="quantidade_produtos">2 produto(s) salvo(s)</p>
    //                 <span class="metric"> 
                    
                    
    //                 </span>
    //             </div>
    //             </a>
    //             <a class="list-product-card" href="http://localhost:3000/listas/merchant/5">
    //             <div class="list-card-images">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/26" class="list-image back">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/25" class="list-image front">
    //                 <span class="badge">+2</span>
    //             </div>
    //             <div class="list-content">
    //                 <h4>ta</h4>
    //                 <p class="quantidade_produtos">2 produto(s) salvo(s)</p>
    //                 <span class="metric"> 
                    
                    
    //                 </span>
    //             </div>
    //             </a>
    //             <a class="list-product-card" href="http://localhost:3000/listas/merchant/5">
    //             <div class="list-card-images">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/26" class="list-image back">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/25" class="list-image front">
    //                 <span class="badge">+2</span>
    //             </div>
    //             <div class="list-content">
    //                 <h4>ta</h4>
    //                 <p class="quantidade_produtos">2 produto(s) salvo(s)</p>
    //                 <span class="metric"> 
                    
                    
    //                 </span>
    //             </div>
    //             </a>
    //             <a class="list-product-card" href="http://localhost:3000/listas/merchant/5">
    //             <div class="list-card-images">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/26" class="list-image back">
    //                 <img src="http://localhost:3000/api/produto_imagens/buscar_imagem/25" class="list-image front">
    //                 <span class="badge">+2</span>
    //             </div>
    //             <div class="list-content">
    //                 <h4>taaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</h4>
    //                 <p class="quantidade_produtos">2 produto(s) salvo(s)</p>
    //                 <span class="metric"> 
                    
                    
    //                 </span>
    //             </div>
    //             </a>
            
    //             </section>

    //             <!-- Rodapé do Story -->
    //             <div class="footer-story">
    //                 <span class="call-to-action">Acesse agora</span>
    //                 <img src="../assets/icons/guide-transparente.png" class="icone-guide">
    //             </div>
    //         </div>

    // `
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
            const dataUrl = await window.htmlToImage.toPng(storyCard, {
                quality: 0.95,
                pixelRatio: 2,
                width: 1080,
                height: 1920,
                style: {
                    transform: 'scale(3)', // Escala o card de 360x640 para 1080x1920
                    transformOrigin: 'top left',
                    width: '360px',
                    height: '640px'
                },
                backgroundColor: '#ffffff', // Define o fundo como branco sólido
                // Desativa a tentativa de ler e embutir folhas de estilo externas do Google Fonts
                fontEmbedCSS: '', 
                // Filtra links CSS que quebraram ou não pertencem ao mesmo domínio
                filter: (node) => {
                if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                    return node.href.includes(window.location.origin);
                }
                return true;
                },
                // Ignora erros de imagens ou fontes que falharem ao carregar
                skipAnimationFrame: true,
            });

        // Cria um link temporário para forçar o download
        const link = document.createElement('a');
        link.download = `divulgacao-story-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        popupMessage({
        titulo : "Sucesso!",
        mensagem : "Download iniciado! Divulgue como quiser.",
        textoBotao : "OK"
        })
       
    

        } catch (error) {
        console.error('Erro ao gerar a imagem do story:', error);
        }
    });
    }