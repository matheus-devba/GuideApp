import { API_BASE_URL } from "../api/config.js"
import { filterLists, searchRenderLists } from "../components/searchLista.js";
import { verificarUser, getLojaId, insertNomeDaLoja, verificacaoUsuario } from "../services/requisicoesMerchant.js";
import { initListas } from "./listas.js";


const pathParts = window.location.pathname.split("/")
const idLista = Number(pathParts[pathParts.length - 1])
const optionsContainer = document.querySelector('.options-group')


export async function initLista() {
  // Só continua se a URL trouxer um ID válido
  if (!Number.isInteger(idLista)) return

  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.
  

  // Aguarda a lista renderizar para montar as opções e ligar o botão
  await renderLista(idLista)
  renderListActions(idLista)
  bindDeleteItem()
}

async function renderLista(lista_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  // 1) Busca IDs dos itens da lista
  const responseIdProdutos = await fetch(`${API_BASE_URL}/api/lista-produtos/lista/${lista_id}`);
  const idProdutos = await responseIdProdutos.json();

  // 2) Busca dados reais de cada produto
  const cardsHtml = await Promise.all(
    idProdutos.map(async (item) => {
      const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/${item.produto_id}`);
      const product = await responseProdutos.json();

      if (!product) return "";

      return `
        <div class="product-card-item">
          <a class="product-card-all" href="${API_BASE_URL}/produtos/merchant/${product.id}">
            <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
            <div class="product-info-all">
              <h2>${product.nome}</h2>
              <span class="metrics-product-all">
                <p class="views" hidden>${product.views || 0}</p>
              </span>
              <div class="product-footer-all">
                <div class="price-group-all">
                  <span class="promocional-price">R$ ${product.preco_promocional} </span>
                  <span class="normal-price-all">R$ ${product.preco_normal}</span>
                </div>
                <button type="button">Ver</button>
              </div>
            </div>
          </a>
        </div>
      `;
    })
  );

  container.innerHTML = cardsHtml.join("");
}

function renderListActions(lista_id) {
  if (!optionsContainer) return;

  // Botões da tela criados uma vez, fora do loop de produtos
  optionsContainer.innerHTML = `
    <a class="product-options edit" href="${API_BASE_URL}/lista-produto/update/${lista_id}">Editar</a>
    <a class="product-options delete" id="delete" href="#">Excluir</a>
  `;
}

function bindDeleteItem() {
  const deleteBtn = optionsContainer?.querySelector('#delete');

  // Não quebra se o botão não existir
  if (!deleteBtn || !Number.isInteger(idLista)) return;

  deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const confirmAction = prompt('Deseja realmente excluir esta Lista? (Digite "sim" para confirmar)');

    if (confirmAction && confirmAction.toLowerCase() === "sim") {
      try {
        // Rota correta no backend é /merchant/deletar/:id
        const response = await fetch(`${API_BASE_URL}/api/listas/merchant/deletar/${idLista}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: idLista }) // controller atual lê do body
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        alert('Lista excluída com sucesso!');
        history.back()
        initListas()
      } catch (error) {
        console.error("Erro ao excluir lista:", error);
        alert('Não foi possível excluir lista. Tente novamente mais tarde.');
      }
    }
  });
}