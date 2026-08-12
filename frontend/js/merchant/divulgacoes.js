import { MediaService } from "../../media/services/MediaService.js"
import { API_BASE_URL } from "../api/config.js"
import { embaralharArray } from "../components/embaralharArray.js";
import { popupMessage } from "../components/popup.js";
import { requestJSON } from "../components/responseJSON.js";
import { getLojaId } from "../services/requisicoesMerchant.js";
import { initDivulgacao } from "./divulgacao.js";

const lojaId = 24 //fixo por enquanto


const divulgacoes = [
    {
      "id": 2,
      "titulo": "Divulgar promoções",
      "descricao": "Destaque suas ofertas e descontos especiais para atrair compradores rapidamente.",
      "emoji": "🏷️",
      "template": "template_2",
      "rota": "/produtos/ativos",
      "limit": 4,
      "tipo": "produtos",
      "headline": "Super Ofertas Liberadas!",
      "sub_headline": "Clique no link abaixo para ver todas as promoções no nosso catálogo do Guide."
    },
    {
      "id": 10,
      "titulo": "Divulgar produtos em destaque",
      "descricao": "Dê visibilidade máxima aos seus itens mais vendidos ou estrategicamente mais importantes.",
      "emoji": "⭐",
      "template": "template_2",
      "rota": "/produtos/destaques",
      "limit": 4,
      "tipo": "produtos",
      "headline": "Os Mais Desejados da Loja",
      "sub_headline": "Acesse nosso espaço no Guide e confira a seleção exclusiva dos favoritos."
    },
    {
      "id": 3,
      "titulo": "Divulgar os produtos mais recentes",
      "descricao": "Apresente as novidades da sua loja e desperte o interesse pelos seus novos produtos.",
      "emoji": "🚀",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2,
      "tipo": "produtos",
      "headline": "Novidades Chegando Agora!",
      "sub_headline": "Clique no link para explorar em primeira mão os lançamentos no Guide."
    },
    {
      "id": 1,
      "titulo": "Divulgar catálogo",
      "descricao": "Divulgue seu catálogo de produtos para alcançar mais clientes e aumentar suas vendas.",
      "emoji": "📖",
      "template": "template_2",
      "rota": "/produtos/ativos",
      "limit": 4,
      "tipo": "produtos",
      "headline": "Conheça Nossa Loja Completa",
      "sub_headline": "Clique abaixo para navegar pelo nosso catálogo interativo no Guide."
    },
    {
      "id": 8,
      "titulo": "Compartilhar no WhatsApp",
      "descricao": "Envie links e imagens diretamente nas conversas e grupos do WhatsApp.",
      "emoji": "💬",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2,
      "tipo": "produtos",
      "headline": "Confira Nossas Opções Exclusivas!",
      "sub_headline": "Clique no link para abrir nosso catálogo completo no Guide e escolher os seus favoritos."
    },
    {
      "id": 9,
      "titulo": "Compartilhar no Instagram",
      "descricao": "Promova seus produtos no Feed e nos Stories para engajar seguidores no Instagram.",
      "emoji": "📸",
      "template": "template_1",
      "rota": "/produtos/ativos",
      "limit": 2,
      "tipo": "produtos",
      "headline": "Viu no Story? Tem Muito Mais!",
      "sub_headline": "Acesse o link da nossa bio ou toque abaixo para ver a vitrine completa no Guide."
    },
    {
      "id": 4,
      "titulo": "Divulgar categorias",
      "descricao": "Organize e apresente suas diferentes seções de produtos para facilitar a navegação.",
      "emoji": "🗂️",
      "template": "template_2",
      "rota": "/categorias/lojas",
      "limit": 4,
      "tipo": "categorias",
      "headline": "Tudo Separado para Você",
      "sub_headline": "Clique no link para explorar nossas categorias organizadas no Guide."
    },
    {
      "id": 5,
      "titulo": "Divulgar listas",
      "descricao": "Compartilhe seleções personalizadas e temáticas de produtos com seus clientes.",
      "emoji": "📝",
      "template": "template_2",
      "rota": "/listas/lojas",
      "limit": 4,
      "tipo": "listas",
      "headline": "Seleção Especial Esperando por Você",
      "sub_headline": "Acesse o link e veja a lista completa que preparamos no Guide."
    },
    {
      "id": 6,
      "titulo": "Atrair visitas",
      "descricao": "Gere mais tráfego e direcione novos potenciais clientes para a sua loja.",
      "emoji": "🎯",
      "template": "template_2",
      "rota": "/produtos/ativos",
      "limit": 4,
      "tipo": "produtos",
      "headline": "Venha Descobrir Nossas Vantagens!",
      "sub_headline": "Clique no link para acessar nossa vitrine digital no Guide agora mesmo."
    },
    // {
    //   "id": 7,
    //   "titulo": "Imprimir QR Code",
    //   "descricao": "Gere códigos escaneáveis para materiais impressos e facilite o acesso rápido ao seu catálogo.",
    //   "emoji": "🖨️",
    //   "template": "template_1",
    //   "rota": "/produtos/ativos",
    //   "limit": 2,
    //   "tipo": "produtos",
    //   "headline": "Aponte a Câmera do Seu Celular!",
    //   "sub_headline": "Escaneie o QR Code para abrir direto a nossa loja no Guide."
    // }
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

export function eventosDivulgacoes() {
  const cards = document.querySelectorAll('.divulgacao-card')
  cards.forEach((button) => {
        button.addEventListener("click", async() => {
          const divulgacao = divulgacoes.find(d => Number(d.id) == Number(button.dataset.id))
          
          if (divulgacao) {
            const data = await buscarDados(divulgacao)
            const mediaService = new MediaService()

            if (data.length == 0) {
              popupMessage({
                titulo : "Opa!",
                mensagem : "Você não tem produtos suficientes para isso.",
                textoBotao : "OK"
              })
              return
            }
      
            const html = await mediaService.generate({
              template : divulgacao.template, 
              data : data,
              tipo: divulgacao.tipo,
              divulgacao: divulgacao
            })
          // 1. Salva o HTML no localStorage para ser lido na próxima página
          localStorage.setItem("divulgacao_html", html);
          

          // 2. Redireciona para a nova página
          window.location.href = "/merchant/divulgacao.html";
            }
        })
    })

}


async function buscarDados (divulgacao) {
  try {
    const rota = divulgacao.rota
    const template = divulgacao.template
    const limit = divulgacao.limit

    const data = await requestJSON(`${API_BASE_URL}/api${rota}/${lojaId}`)
    const produtos = embaralharArray(data)
    const dataLimit = produtos.slice(0, limit)
    console.log(dataLimit)
    return dataLimit

  } catch (error) {
     console.error("Erro ao buscar dados:", error);
  }
} 