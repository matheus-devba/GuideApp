// templates/story/StoryTemplate.js

class StoryTemplate {

    render(data) {

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

module.exports = new StoryTemplate();