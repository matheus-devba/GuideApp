const divulgacoes = [
    {
      "id": 2,
      "titulo": "Divulgar promoções",
      "descricao": "Destaque suas ofertas e descontos especiais para atrair compradores rapidamente.",
      "emoji": "🏷️"
    },
    {
      "id": 10,
      "titulo": "Divulgar produtos em destaque",
      "descricao": "Dê visibilidade máxima aos seus itens mais vendidos ou estrategicamente mais importantes.",
      "emoji": "⭐"
    },
    {
      "id": 3,
      "titulo": "Divulgar os produtos mais recentes",
      "descricao": "Apresente as novidades da sua loja e desperte o interesse pelos seus novos produtos.",
      "emoji": "🚀"
    },
    {
      "id": 1,
      "titulo": "Divulgar catálogo",
      "descricao": "Divulgue seu catálogo de produtos para alcançar mais clientes e aumentar suas vendas.",
      "emoji": "📖"
    },
    {
      "id": 8,
      "titulo": "Compartilhar no WhatsApp",
      "descricao": "Envie links e imagens diretamente nas conversas e grupos do WhatsApp.",
      "emoji": "💬"
    },
    {
      "id": 9,
      "titulo": "Compartilhar no Instagram",
      "descricao": "Promova seus produtos no Feed e nos Stories para engajar seguidores no Instagram.",
      "emoji": "📸"
    },
    {
      "id": 4,
      "titulo": "Divulgar categorias",
      "descricao": "Organize e apresente suas diferentes seções de produtos para facilitar a navegação.",
      "emoji": "🗂️"
    },
    {
      "id": 5,
      "titulo": "Divulgar listas",
      "descricao": "Compartilhe seleções personalizadas e temáticas de produtos com seus clientes.",
      "emoji": "📝"
    },
    {
      "id": 6,
      "titulo": "Atrair visitas",
      "descricao": "Gere mais tráfego e direcione novos potenciais clientes para a sua loja.",
      "emoji": "🎯"
    },
    {
      "id": 7,
      "titulo": "Imprimir QR Code",
      "descricao": "Gere códigos escaneáveis para materiais impressos e facilite o acesso rápido ao seu catálogo.",
      "emoji": "🖨️"
    }
];


export function initDivulgacoes() {
    renderDivulgacoes()
}


function renderDivulgacoes() {
const container = document.querySelector('.divulgacoes-list-all')
if (!container) return


container.innerHTML = divulgacoes.map((divulgacao) => {
    // Adicionado o 'return' para que o HTML de cada item seja retornado
    return `
        <a class="divulgacao-card" href="">
            <div class="divulgacao-card-images">
                <span class="card-emoji">${divulgacao.emoji}</span>
            </div>

            <div class="divulgacao-content">
                <h4>${divulgacao.titulo}</h4>
                <p>Publique nos status ou stories</p>
            </div>
        </a>
    `;
}).join(''); 


  
}

