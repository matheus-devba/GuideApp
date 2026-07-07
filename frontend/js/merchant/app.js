import { initLista } from "../consumer/lista.js";
import { initDestaques } from "../consumer/destaques.js";
import { initProdutos } from "../merchant/produtos.js";
import { initCategoria } from "../consumer/categoria.js";
import { initProduto} from "../merchant/produto.js";
import { initSearch} from "../merchant/pesquisa.js";
import { initFormProduto } from "../merchant/formProduto.js";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("lista.html")) {
    initLista();
  }

  if (path.includes("destaques.html")) {
    initDestaques();
  }
  if (path.includes("produtos.html")) {
    initProdutos();
  }

  if (path.includes("categoria.html")) {
    initCategoria();
  }
  if (path.includes("produto.html")) {
    initProduto();
  }
  if (path.includes("pesquisa.html")) {
    initSearch();
  }
  if (path.includes("formProduto.html")) {
    initFormProduto();
  }
});