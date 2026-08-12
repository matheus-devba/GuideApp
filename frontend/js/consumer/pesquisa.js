import { searchRenderProduct } from "../components/searchProduto.js";
import { API_BASE_URL } from "../api/config.js";
import { insertNomeDaLoja } from "../services/requisicoesConsumer.js";
import { renderFooter } from "../components/footerNavegation.js";

export async function initSearch() {
  const params = new URLSearchParams(window.location.search);
  const caminho = window.location.pathname.split("/").filter(Boolean);
  
  const filtro = params.get("filter") || "ativos";
  const itemQuery = params.get("query") || ""; // Evita exibir "null" no input

  // Captura o categoria_id de forma segura
  const categoriaParam = params.get("categoria_id");
  const categoria_id = categoriaParam !== null ? Number(categoriaParam) : null;

  // Captura o loja_id e garante um valor padrão caso dê NaN
  const lojaParam = params.get("loja_id") || caminho[caminho.length - 1];
  const loja_id = Number(lojaParam) || 0; 
  renderFooter()

  let produtos = [];

  // Tratamento de erros básico para as requisições
  try {
    if (categoria_id === null) {
      const response = await fetch(`${API_BASE_URL}/api/produtos/${filtro}/${loja_id}`);
      produtos = await response.json();
    } else {
      const responseProdutos = await fetch(
        `${API_BASE_URL}/api/produtos/categorias/${categoria_id}?loja_id=${loja_id}`
      );
      produtos = await responseProdutos.json();
    }

    await insertNomeDaLoja(loja_id);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
    
  // Verifica se o input realmente existe antes de manipular o DOM
  const searchInput = document.querySelector('.search');
  if (searchInput) {
    searchInput.value = itemQuery;
  }
  
  searchRenderProduct(itemQuery, produtos, loja_id);
} 

//   const params = new URLSearchParams(window.location.search)
//   const caminho = window.location.pathname.split("/").filter(Boolean)
//   const loja_id = Number(params.get("loja_id") || caminho[caminho.length - 1])
//   const isDestaque = params.get("destaques") || ""
//   const itemQuery = params.get("query") || ""


//   if (!loja_id || !Number.isInteger(loja_id)) {
//     console.error("Pesquisa sem loja definida.");
//     return;
//   }

 
//   const filtros = new URLSearchParams()
  
//   filtros.set("q", itemQuery)

//   if (isDestaque !== "") filtros.set("destaques", "true")

//   const response = await fetch(
//    `${API_BASE_URL}/api/produtos/search/loja/${loja_id}?${filtros.toString()}`
//   )

//  if (!response.ok) {
//     console.error("Falha ao buscar produtos");
//     return;
//   }

//   const produtos = await response.json();

//   await insertNomeDaLoja(loja_id);

//   const searchInput = document.querySelector('.search') || document.querySelector('input[name="query"]');  if (searchInput) searchInput.value = itemQuery;

//   if (searchInput) searchInput.value = itemQuery
//   searchRenderProduct(itemQuery, produtos);
