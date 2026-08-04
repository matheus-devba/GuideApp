import { initProdutos } from "../merchant/produtos.js";
import { initPerfil } from "../merchant/perfil.js";
import { initProduto } from "../merchant/produto.js";
import { initCreateProduto } from "./formProdutoCreate.js";
import { initEditProduto } from "./formProdutoEdit.js";
import { initListas } from "../merchant/listas.js";
import { initLista } from "./lista.js";
import { initFormListaUpdate } from "./formListaUpdate.js";
import { initFormListaCreate } from "./formListaCreate.js";
import { initLogin } from "./login.js";
import { initSearchLoja } from "./pesquisa.js";
import { initHome } from "./home.js";
import { initDivulgacoes } from "./divulgacoes.js";

const path = window.location.pathname;

if (path === "/produtos/merchant/new") { 
  initCreateProduto()
} else if (path === "/merchant/produtos") {
  initProdutos()
} else if (/^\/produtos\/update\/\d+$/.test(path))  {
  initEditProduto()
}

else if (/^\/produtos\/merchant\/\d+$/.test(path)) {
  initProduto()
}

if (/^\/listas\/merchant\/\d+$/.test(path)) {
  initLista()
}

if (path === '/listas/merchant/new') {
  initFormListaCreate()
}

if (/^\/lista-produto\/update\/\d+$/.test(path)) {
  initFormListaUpdate()
}

if (path === '/merchant/login') {
  initLogin()
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;


  if (path.includes("perfil.html")) {
    initPerfil();
  }

  if (path.includes("produtos.html")) {
    initProdutos();
  }

  if (path.includes("listas.html")) {
    initListas();
  }

  if (path.includes("pesquisa.html")) {
    initSearchLoja();
  }
  if (path.includes("home.html")) {
    initHome()
  }
  if (path.includes("divulgacoes.html")) {
    initDivulgacoes()
  }
});