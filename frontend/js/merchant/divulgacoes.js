import { MediaService } from "../../media/services/MediaService.js"
import { API_BASE_URL } from "../api/config.js"
import { getLojaId } from "../services/requisicoesMerchant.js";

const lojaId = 24 //fixo por enquanto


const divulgacoes = [
    {
      "id": 2,
      "titulo": "Divulgar promoções",
      "descricao": "Destaque suas ofertas e descontos especiais para atrair compradores rrotadamente.",
      "emoji": "🏷️",
      "template": "template_2",
      "rota": "/produtos/ativos",
      "limit": 4
    },
    {
      "id": 10,
      "titulo": "Divulgar produtos em destaque",
      "descricao": "Dê visibilidade máxima aos seus itens mais vendidos ou estrategicamente mais importantes.",
      "emoji": "⭐",
      "template": "template_2",
      "rota": "/produtos/destaques",
      "limit": 4
    },
    {
      "id": 3,
      "titulo": "Divulgar os produtos mais recentes",
      "descricao": "Apresente as novidades da sua loja e desperte o interesse pelos seus novos produtos.",
      "emoji": "🚀",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2
    },
    {
      "id": 1,
      "titulo": "Divulgar catálogo",
      "descricao": "Divulgue seu catálogo de produtos para alcançar mais clientes e aumentar suas vendas.",
      "emoji": "📖",
      "template": "template_2",
      "rota": "/produtos/ativos",
      "limit": 4
    },
    {
      "id": 8,
      "titulo": "Compartilhar no WhatsApp",
      "descricao": "Envie links e imagens diretamente nas conversas e grupos do WhatsApp.",
      "emoji": "💬",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2
      
    },
    {
      "id": 9,
      "titulo": "Compartilhar no Instagram",
      "descricao": "Promova seus produtos no Feed e nos Stories para engajar seguidores no Instagram.",
      "emoji": "📸",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2
    },
    {
      "id": 4,
      "titulo": "Divulgar categorias",
      "descricao": "Organize e apresente suas diferentes seções de produtos para facilitar a navegação.",
      "emoji": "🗂️",
      "template": "template_2",
      "rota" :"/categorias/lojas",
      "limit": 4
    },
    {
      "id": 5,
      "titulo": "Divulgar listas",
      "descricao": "Compartilhe seleções personalizadas e temáticas de produtos com seus clientes.",
      "emoji": "📝",
      "template": "template_2",
      "rota" :"/listas/lojas",
      "limit": 4
    },
    {
      "id": 6,
      "titulo": "Atrair visitas",
      "descricao": "Gere mais tráfego e direcione novos potenciais clientes para a sua loja.",
      "emoji": "🎯",
      "template": "template_2",
      "rota": "/produtos/ativos",
      "limit": 4
    },
    {
      "id": 7,
      "titulo": "Imprimir QR Code",
      "descricao": "Gere códigos escaneáveis para materiais impressos e facilite o acesso rápido ao seu catálogo.",
      "emoji": "🖨️",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2
    }
];


export function initDivulgacoes() {
    renderDivulgacoes()
    eventosDivulgacoes()
}


function renderDivulgacoes() {
  const container = document.querySelector('.divulgacoes-list-all')
  if (!container) return


  container.innerHTML = divulgacoes.map((divulgacao) => {
      // Adicionado o 'return' para que o HTML de cada item seja retornado
      return `
          <a class="divulgacao-card" data-id="${divulgacao.id}">
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

function eventosDivulgacoes() {
  const cards = document.querySelectorAll('.divulgacao-card')
  cards.forEach((button) => {
        button.addEventListener("click", async() => {
          const divulgacao = divulgacoes.find(d => Number(d.id) == Number(button.dataset.id))
          
          if (divulgacao) {
            const data = await buscarDados(divulgacao)
            const mediaService = new MediaService()
      
            await mediaService.generate({
              template : divulgacao.template, 
              data : data
            })
          }
        })
    })

}


async function buscarDados (divulgacao) {
  try {
    const rota = divulgacao.rota
    const template = divulgacao.template
    const limit = divulgacao.limit

    const response = await fetch(`${API_BASE_URL}/api${rota}/${lojaId}`)
    const data = await response.json()

    const dataLimit = data.slice(0, limit)

    return dataLimit

  } catch (error) {
     console.error("Erro ao buscar dados:", error);
  }
} 