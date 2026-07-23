import { initProdutos } from "../merchant/produtos.js";
import { initPerfil } from "../merchant/perfil.js";
import { initProduto } from "../merchant/produto.js";
import { initFormLista } from "../merchant/formLista.js";
import { initCreateProduto } from "./formProdutoCreate.js";
import { initEditProduto } from "./formProdutoEdit.js";
import { initListas } from "../merchant/listas.js";
import { initDestaques } from "../merchant/destaques.js";

const path = window.location.pathname;

if (path === "/produtos/new") { 
  initCreateProduto()
} else if (path === "/merchant/produtos") {
  initProdutos()
} else if (/^\/produtos\/update\/\d+$/.test(path))  {
  initEditProduto()
}

else if (/^\/produtos\/\d+$/.test(path)) {
  initProduto()
}


document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;


  if (path.includes("perfil.html")) {
    initPerfil();
  }

  if (path.includes("destaques.html")) {
    initDestaques();
  }
  if (path.includes("produtos.html")) {
    initProdutos();
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