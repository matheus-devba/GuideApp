import { filterProducts } from "../components/searchProduto.js"
import {getListaID, renderProdutos, searchProductList, bindSelection, renderSelectedProducts} from "./formLista.shared.js"
import { API_BASE_URL } from "../api/config.js"


export async function initDestaques() {
   const containerPrincipal = document.querySelector(".product-list-all");
   const containerSelected = document.querySelector(".selected-products");
 
   const reponseDestaques = await fetch(`${API_BASE_URL}/api/produtos/destaques`)
   const produtosDestaques = await reponseDestaques.json()

   console.log(produtosDestaques)

   const selectedProductsState = produtosDestaques ?? [];
 
   const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/ativosAll`)
   const produtosAtivos = await responseProdutos.json()
 
   renderProdutos(produtosAtivos, containerPrincipal, selectedProductsState);
   renderSelectedProducts(selectedProductsState, containerSelected);
   searchProductList(containerPrincipal, selectedProductsState, containerSelected);
 
   bindSelection(
     containerPrincipal,
     containerSelected,
     selectedProductsState
   );
 
   const form = document.querySelector('.destaques-form')  
   form.addEventListener("submit", (handleSubmit)); //envia os produtos
};


async function handleSubmit(event) {
  event.preventDefault();

  // 1. Captura os IDs dos produtos selecionados
  const produtos = Array.from(
    document.querySelectorAll(".product-card-all .selectProduct:checked")
  )
    .map((checkbox) => Number(checkbox.closest(".product-card-all")?.dataset?.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  // Validação: para se não houver produtos selecionados
  if (produtos.length < 1) {
    alert("Selecione pelo menos um produto.");
    return;
  }

  try {
    // 2. Executa um fetch para cada ID da lista
    for (const idProduto of produtos) {
      const responseProdutos = await fetch(`${API_BASE_URL}/api/produtos/update/${idProduto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idProduto, status), // Envie o corpo que seu backend espera
      });

      if (!responseProdutos.ok) {
        const erroProdutos = await responseProdutos.json().catch(() => ({}));
        throw new Error(`Erro no produto ${idProduto}: HTTP ${responseProdutos.status} - ${erroProdutos.message || "Erro ao atualizar"}`);
      }
    }

    alert("Produtos atualizados com sucesso!");
    // Redirecione para onde preferir, já que idLista não existe nesse escopo
    window.location.href = `/listas/merchant/`; 

  } catch (error) {
    console.error("Erro ao processar lista:", error);
    alert(error.message || "Não foi possível atualizar os produtos.");
  }
}
