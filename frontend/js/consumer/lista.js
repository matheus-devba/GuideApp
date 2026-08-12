import { API_BASE_URL } from "../api/config.js"
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { formatMoney } from '../utils/formatMoney.js'
import { btnShare } from '../components/shareButton.js'
import { popupMessage, popupConfirm } from "../components/popup.js";
import { requestJSON } from "../components/responseJSON.js";
import { renderFooter } from "../components/footerNavegation.js";



export async function initLista() {
  const params = new URLSearchParams(window.location.search)
  const loja_id = Number(params.get("loja_id"))
  const list_id = Number(params.get("list_id"))
  await insertNomeDaLoja(loja_id)
  await renderLista(list_id, loja_id);
  ctaLista(loja_id, list_id);
  renderFooter()
}



async function renderLista (list_id, loja_id) {
  const container = document.querySelector(".product-list-all");
  if (!container) return;

  btnShare(`/listas/${list_id}?list_id=${list_id}&loja_id=${loja_id}`, 
            "Olha o que achei no Guide",
            "Dê uma olhada nessa lista que encontrei no Guide:")

  

  const [lista, listaProduto] = await Promise.all([
    requestJSON(`${API_BASE_URL}/api/listas/${list_id}`),
    requestJSON(`${API_BASE_URL}/api/lista-produtos/lista/${list_id}`)
  ]);   


  if (!lista || !listaProduto) return;

  const titleList = document.querySelector(".sections-title")
  titleList.innerHTML = lista.nome


  // 2) Busca dados reais de cada produto
  const cardsHtml = await Promise.all(
    listaProduto.map(async (item) => {
      const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/${item.produto_id}`);
      const product = await responseProdutos.json();

      if (!product) return "";

            // Valida se há preço promocional (checa se não é null, undefined ou string vazia)
      const temPromocao = product.preco_promocional !== null && product.preco_promocional !== "";
      
      // Define qual será o preço em destaque
      const precoExibido = temPromocao ? product.preco_promocional : product.preco_normal;



      return `
        <div class="product-card-item">
          <a class="product-card-all"href="${API_BASE_URL}/produtos/${product.id}?loja_id=${loja_id}&produto_id=${product.id}">
          <input 
            type="checkbox" 
            class="selectProduct"
            data-nome="${product.nome}"
            data-preco="${formatMoney(precoExibido)}"
          >
            <img class="product-image-all" src="${API_BASE_URL}/api/produto_imagens/buscar_imagem/${product.id}">
            <div class="product-info-all">
                <h2>${product.nome}</h2>
                <span class="metrics-product-all">
                    <img class="eye" hidden src="../assets/icons/eye.png">
                    <p class="views" hidden>${product.views}</p>
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
        </div>
      `;
    })
  );

  container.innerHTML = cardsHtml.join("");
  
}



function obterProdutosSelecionados() {
  const checkboxes = document.querySelectorAll('.selectProduct:checked');
  
  return Array.from(checkboxes).map(checkbox => {
    return {
      nome: checkbox.dataset.nome,
      preco: checkbox.dataset.preco
    };
  });
}

function ctaLista(loja_id, list_id) {
  const btn = document.querySelector('.cta-product');
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const produtosSelecionados = obterProdutosSelecionados();
      
    // Se o usuário não marcou nenhum produto, avisa e para a execução
    if (produtosSelecionados.length === 0) {
      popupMessage({
      titulo: "Opa!",
      mensagem: "Por favor, selecione pelo menos um produto!"
      })
      return;
    }

    try {
    const [responseLoja, responseLista] = await Promise.all (
      [
        fetch(`${API_BASE_URL}/api/lojas/${loja_id}`),
        fetch(`${API_BASE_URL}/api/listas/${list_id}`)
      ]
    )

    const loja = await responseLoja.json()
    const lista = await responseLista.json()

    // Cria o cabeçalho da mensagem
    let textoMensagem = `Olá \u{1F60D}! Vim do Guide e tenho interesse nos seguintes produtos da lista ${lista.nome}:\n\n`;

    // Mapeia os produtos adicionando uma quebra de linha real (\n) para cada um
    produtosSelecionados.forEach(prod => {
      textoMensagem += `• *${prod.nome}* no valor de ${prod.preco}\n`;
    });

    // O encodeURIComponent transforma automaticamente os "\n" em "%0A" (quebra de linha do WhatsApp)
    const textoCodificado = encodeURIComponent(textoMensagem);
    
    let telefone = loja.whatsapp ? loja.whatsapp.replace(/\D/g, '') : '';
      if (telefone && !telefone.startsWith('55')) {
        telefone = `55${telefone}`;
      }

    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${telefone}&text=${textoCodificado}`;

    // Tenta abrir numa nova aba
    const newTab = window.open(urlWhatsapp, '_blank');
    if (!newTab) {
      window.location.href = urlWhatsapp;
    }


  } catch (error) {
    console.error("Erro na execução do CTA:", error);
          popupMessage({
          titulo: "Opa!",
          mensagem: "Houve um problema ao processar seu pedido. Tente novamente."
      })
  }
  });
}
