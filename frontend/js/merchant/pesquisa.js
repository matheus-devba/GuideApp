import { searchRenderProduct } from "../components/searchProduto.js";
import { products } from "../mocks/produtos_db.js";
import { API_BASE_URL } from "../api/config.js"
import { getLojaId } from "../services/requisicoesMerchant.js";

export async function initSearchLoja() {
  const params = new URLSearchParams(window.location.search);
  const itemQuery = params.get("query");
  const lojaId = await getLojaId()
  
  const response = await fetch(`${API_BASE_URL}/api/produtos/ativos/${lojaId.id}`)
  const produtos = await response.json()

    
  const searchInput = document.querySelector('.search')
  searchInput.value = itemQuery
  
  searchRenderProduct(itemQuery, produtos);

  
}

