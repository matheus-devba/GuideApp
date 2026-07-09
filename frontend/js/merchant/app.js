import { initProdutos } from "../merchant/produtos.js";
import { initCategoria } from "../consumer/categoria.js";
import { initProduto} from "../merchant/produto.js";
import { initFormLista} from "../merchant/formLista.js";
import { initFormProduto } from "../merchant/formProduto.js";
import { initListas } from "../merchant/listas.js";
import { initDestaques } from "../merchant/destaques.js";


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
  if (path.includes("formLista.html")) {
    initFormLista();
  }
  if (path.includes("formProduto.html")) {
    initFormProduto();
  }
  if (path.includes("listas.html")) {
    initListas();
  }
});