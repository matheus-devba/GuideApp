// templates/story/StoryTemplate.js
import { API_BASE_URL } from "../../js/api/config.js"
import { getLojaId } from "../../js/services/requisicoesMerchant.js";
import { requestJSON } from "../../js/components/responseJSON.js"
import { formatMoney } from "../../js/utils/formatMoney.js";



export class Template {
    static async buscarLoja() {
        const lojaId = 24 // fixo por enquanto
        const response = await requestJSON(`${API_BASE_URL}/api/lojas/${lojaId}`)
        return response
    }

    static async renderProdutos(data) {
        if (!data || data.length < 1) {
            return "";
        }

        return data.map((product) => {
            const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
            const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;
            const countViews = product.views >= 2 ? `${product.views} visualizações` : "";

            return `
                <a class="product-card" href="" >
             <img class="product-image" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
             <div class="product-info-all">
               <h2>${product.nome}</h2>
               <span class="metrics-product-all">
                 <div class="views-wrapper">
                   <img class="eye" ${countViews === "" ? "hidden" : ""} src="../assets/icons/eye.png">
                   <p class="views">${countViews}</p>
                 </div>
               </span>
               <div class="product-footer-all">
                     <div class="price-group-all">
                       <!-- O formatMoney já adiciona o "R$" automaticamente -->
                       <span class="promocional-price">${formatMoney(precoExibido)}</span>
                       <span class="normal-price-all">${temPromocao ? formatMoney(product.preco_normal) : ""}</span>
                     </div>
                     <button type="button">Ver</button>
                 </div>
                 </div>
         </a>
            `;
        }).join("");
    }

    static async renderCategoria(categoriaLista) {

        if (!categoriaLista || categoriaLista.length < 1) {
            return;
        }

        // 1. Faz as verificações de produtos em paralelo para todas as categorias
        const categoriasValidadas = await Promise.all(
            categoriaLista.map(async (cat) => {
            try {
                const produtos = await requestJSON(`${API_BASE_URL}/api/produtos/categorias/guide/${cat.id}`);
                // Retorna a categoria se tiver pelo menos 1 produto, senão retorna null
                return (produtos && produtos.length > 0) ? cat : null;
            } catch (err) {
                return null;
            }
            })
        );

        // 2. Filtra removendo as categorias nulas (que não tinham produtos)
        const categoriasComProdutos = categoriasValidadas.filter(cat => cat !== null);

        // 3. Controla a visibilidade da seção
        const temDados = categoriasComProdutos.length > 0;

        if (!temDados) return;
        

        // 4. Renderiza apenas as categorias válidas
        return categoriasComProdutos.map((cat) => `
            <a class="circle-category" href="${API_BASE_URL}/categorias/guide/${cat.id}">
            <img src="${cat.icone_url || '../assets/images/default.webp'}" class="category-image" loading="lazy">
            <h4>${cat.nome}</h4>
            </a>
        `).join('');
    }

    static async renderListas(listas) {
        const html = await Promise.all(
            listas.map(async (list) => {
            const responseProdutos = await fetch(
                `${API_BASE_URL}/api/lista-produtos/lista/${list.id}`
            );
            const produtos = await responseProdutos.json();
            
            // if(produtos.length < 1) return //caso nao tiver produtos (mas posso colocar um <=)


            const produtoBack = produtos[0];
            const produtoFront = produtos[1];

            let imageBack = "../assets/images/default.webp"; //caso tiver 1 produto apenas na lista
            let imageFront = "../assets/images/default.webp";

            if (produtoBack) {
                imageBack = `${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtoBack.produto_id}`;
            }
            if (produtoFront) {
                imageFront = `${API_BASE_URL}/api/produto_imagens/buscar_imagem/${produtoFront.produto_id}`;
            }

            return `
                <a class="list-product-card" href="${API_BASE_URL}/listas/merchant/${list.id}">
                <div class="list-card-images">
                    <img src="${imageBack}" class="list-image back">
                    <img src="${imageFront}" class="list-image front">
                    <span class="badge">+${produtos.length}</span>
                </div>
                <div class="list-content">
                    <h4>${list.nome}</h4>
                    <p class="quantidade_produtos">${produtos.length} produto(s) salvo(s)</p>
                    <span class="metric"> 
                    ${list.views < 2 ? "": `<img src="../assets/icons/eye.png" class="metric-icon">`}
                    ${list.views < 2 ? "": `<p class="metric-text">${list.views} visualizações</p>`}
                    </span>
                </div>
                </a>
            `;
            })
        );
    
        return html
    }


    static async template_produtos(data, divulgacao) {
        const loja = await Template.buscarLoja();
        const produtosLista = data || [];
        const produtos = await Template.renderProdutos(produtosLista);

        return `

                    <div class="story-card">
                        <!-- Cabeçalho da Loja -->
                        <div class="header-loja">
                            <img src="${loja.logo_url}" class="logo-loja" alt="Logo">
                            <h1 class="nome-loja">${loja.nome}</h1>
                        </div>

                        <!-- Conteúdo de Texto -->
                        <div class="content-divulgacao">
                            <h2 class="titulo-divulgacao">${divulgacao.headline || 'Conheça a nossa loja'}</h2>
                            <p class="descricao-divulgacao">${divulgacao.sub_headline || 'Produtos organizados, promoções e novidades em um só lugar.'}</p>
                        </div>
                        

                        <!-- Grid com os 2 Cards Padronizados -->
                        <section class="produtos-grid-story">
                            ${produtos}
                        </section>

                        <!-- Rodapé do Story -->
                        <div class="footer-story">
                            <span class="call-to-action">Acesse agora</span>
                            <img src="../assets/icons/guide-transparente.png" class="icone-guide">
                        </div>
                    </div>
  
        `;
    }

    static async template_categorias(data, divulgacao) {
        const loja = await Template.buscarLoja();
        
        const categoriaLista = data || [];
        const categorias = await Template.renderCategoria(categoriaLista);
        console.log(categorias)
       

        return `

            <div class="story-card">
                <!-- Cabeçalho da Loja -->
                <div class="header-loja">
                    <img src="${loja.logo_url}" class="logo-loja" alt="Logo">
                    <h1 class="nome-loja">${loja.nome}</h1>
                </div>

                <!-- Conteúdo de Texto -->
                <div class="content-divulgacao">
                    <h2 class="titulo-divulgacao">${divulgacao.headline || 'Conheça a nossa loja'}</h2>
                    <p class="descricao-divulgacao">${divulgacao.sub_headline || 'Produtos organizados, promoções e novidades em um só lugar.'}</p>
                </div>
                

                <!-- Grid com os 2 Cards Padronizados -->
                <section class="categorias-grid-story" id="template2">
                    ${categorias}
                </section>

                <!-- Rodapé do Story -->
                <div class="footer-story">
                    <span class="call-to-action">Acesse agora</span>
                    <img src="../assets/icons/guide-transparente.png" class="icone-guide">
                </div>
            </div>

        `;
    }

    static async template_listas(data, divulgacao) {
        const loja = await Template.buscarLoja();
        
        const listasAll = data || [];
        const listas = await Template.renderListas(listasAll);
        console.log(listas)
       

        return `

            <div class="story-card">
                <!-- Cabeçalho da Loja -->
                <div class="header-loja">
                    <img src="${loja.logo_url}" class="logo-loja" alt="Logo">
                    <h1 class="nome-loja">${loja.nome}</h1>
                </div>

                <!-- Conteúdo de Texto -->
                <div class="content-divulgacao">
                    <h2 class="titulo-divulgacao">${divulgacao.headline || 'Conheça a nossa loja'}</h2>
                    <p class="descricao-divulgacao">${divulgacao.sub_headline || 'Produtos organizados, promoções e novidades em um só lugar.'}</p>
                </div>
                

                <!-- Grid com os 2 Cards Padronizados -->
                <section class="listas-grid-story">
                    ${listas}
                </section>

                <!-- Rodapé do Story -->
                <div class="footer-story">
                    <span class="call-to-action">Acesse agora</span>
                    <img src="../assets/icons/guide-transparente.png" class="icone-guide">
                </div>
            </div>

        `;
    }


   

}
