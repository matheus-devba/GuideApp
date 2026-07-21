import { filterProducts, searchRender } from "../components/searchProduto.js";
import { products } from "../mocks/produtos_db.js";

export function initSearch() {
  const params = new URLSearchParams(window.location.search);
  const itemQuery = params.get("query");

  searchRender(itemQuery);
  
}

