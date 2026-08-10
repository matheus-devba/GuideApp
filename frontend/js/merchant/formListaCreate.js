import { API_BASE_URL } from "../api/config.js";
import {getListaID, renderProdutos, searchProductList, bindSelection, renderSelectedProducts} from "./formLista.shared.js"
import { filterProducts } from "../components/searchProduto.js"
import { getLojaId, verificacaoUsuario } from "../services/requisicoesMerchant.js";
import { popupMessage } from "../components/popup.js";


export async function initFormListaCreate() {
  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.
 

  const containerPrincipal = document.querySelector(".product-list-all");
  const containerSelected = document.querySelector(".selected-products");

  const selectedProductsState = []

  const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/ativosAll`)
  const produtosAtivos = await responseProdutos.json()

  renderProdutos(produtosAtivos, containerPrincipal, selectedProductsState);
  searchProductList(containerPrincipal, selectedProductsState, containerSelected);

  bindSelection(
    containerPrincipal,
    containerSelected,
    selectedProductsState
  );

  const form = document.querySelector('.newList-form')  
  form.addEventListener("submit", (handleSubmitCreate)); //envia os produtos
}

async function handleSubmitCreate(event) {
  // Evita recarregar a página
  
  event.preventDefault();

  // Pega o nome digitado no formulário
  const nome = document.querySelector("#list-name").value.trim();
  const lojaId = await getLojaId()
  const loja_id = lojaId.id

  if (nome === "") {
    popupMessage({
      titulo: "Opa!",
      mensagem: "Defina o nome antes de criar a lista"
    })
    return;
  }

  // Pega apenas os produtos marcados
  const produtos = Array.from(
    document.querySelectorAll(".product-card-all .selectProduct:checked")
  )
    .map((checkbox) => Number(checkbox.closest(".product-card-all")?.dataset?.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (produtos.length < 2 ) {
    popupMessage({
      titulo: "Opa!",
      mensagem: "Adicione ao menos 2 produtos"
    })
    return
  }

  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const responseLoja = await fetch(`${API_BASE_URL}/api/lojas/${loja_id}`)
    const loja = await responseLoja.json()
    const nicho_id = loja.nicho_id

    const payload = {nome: nome, loja_id: loja_id, nicho_id: nicho_id }
    // 1. Cria a lista e obtém o ID retornado pelo backend
    const responseLista = await fetch(`${API_BASE_URL}/api/listas/merchant/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!responseLista.ok) {
      const erroNome = await responseLista.json().catch(() => ({}));
      throw new Error(`HTTP ${responseLista.status} - ${erroNome.message || "Erro ao criar lista"}`);
    }

    // Extrai os dados da resposta (contendo o ID)
    const dadosLista = await responseLista.json();
    const idLista = dadosLista.id; // Garanta que seu backend retorna o campo 'id'

    // 2. Se houver produtos, salva na rota de vinculação
    if (produtos.length > 0) {
      const responseProdutos = await fetch(`${API_BASE_URL}/api/lista-produtos/update/${idLista}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtos }),
      });

      if (!responseProdutos.ok) {
        const erroProdutos = await responseProdutos.json().catch(() => ({}));
        throw new Error(`HTTP ${responseProdutos.status} - ${erroProdutos.message || "Erro ao adicionar produtos"}`);
      }
    }

    popupMessage({
      titulo: "Sucesso!",
      mensagem: "Lista criada com sucesso!"
    })
    await delay(2000)
    window.location.href = `${API_BASE_URL}/merchant/listas.html`;
  } catch (error) {
    console.error("Erro ao processar lista:", error);
    popupMessage({
      titulo: "Erro!",
      mensagem: "Não foi possível criar a lista. Tente novamente"
    })
  }
}
