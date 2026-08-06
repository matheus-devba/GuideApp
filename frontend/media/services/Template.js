// templates/story/StoryTemplate.js
import { API_BASE_URL } from "../../js/api/config.js"
import { getLojaId } from "../../js/services/requisicoesMerchant.js";



export class Template {
    async buscarLogo() {
        const lojaId = 24 //fixo por enquanto
        const response = await fetch(`${API_BASE_URL}/api/lojas/${lojaId}`)
        const data = await response.json()

        const logo = data.logo_url

        return logo
    }

    
    render1(data) {

        return `
            <html>

                <head>

                    <link rel="stylesheet" href="story.css">

                </head>

                <body>

                    <div class="story">

                        <img src="${data.logo}" class="logo">

                        <h1>${data.headline}</h1>

                        <img src="${data.produto.imagem}" class="produto">

                        <span class="preco">
                            R$ ${data.produto.preco}
                        </span>

                    </div>

                </body>

            </html>
        `;

    }

    render2(data) {

        return `
            <html>

                <head>

                    <link rel="stylesheet" href="story.css">

                </head>

                <body>

                    <div class="story">

                        <img src="${data.logo}" class="logo">

                        <h1>${data.headline}</h1>

                        <img src="${data.produto.imagem}" class="produto">

                        <span class="preco">
                            R$ ${data.produto.preco}
                        </span>

                    </div>

                </body>

            </html>
        `;

    }

}

// module.exports = new StoryTemplate();