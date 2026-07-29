import { initLoja } from "../consumer/loja.js";
import { initLista } from "../consumer/lista.js";
import { initDestaques } from "../consumer/destaques.js";
import { initProdutos } from "../consumer/produtos.js";
import { initCategoria } from "../consumer/categoria.js";
import { initProduto} from "../consumer/produto.js";
import { initSearch} from "../consumer/pesquisa.js";
import { initLojas } from "../consumer/lojas.js";

// const path = window.location.pathname
// if (path.startsWith("/lojas/")) {
//   initLoja()
// }
const path = window.location.pathname;

 if (/^\/lojas\/\d+$/.test(path)) {
  initLoja()
}
 if (/^\/listas\/\d+$/.test(path)) {
  initLista()
}
 if (/^\/destaques\/\d+$/.test(path)) {
  initDestaques()
}
 if (/^\/categorias\/\d+$/.test(path)) {
  initCategoria()
}
 if (/^\/produtos\/\d+$/.test(path)) {
  initProduto()
}

// document.addEventListener("DOMContentLoaded", () => {
//   const path = window.location.pathname;

//   if (path.includes("lojas")) {
//     initLojas()
//   }
//   if (path.includes("loja.html")) {
//     initLoja();
//   }

//   if (path.includes("lista.html")) {
//     initLista();
//   }

//   if (path.includes("destaques.html")) {
//     initDestaques();
//   }
//   if (path.includes("produtos.html")) {
//     initProdutos();
//   }

//   if (path.includes("categoria.html")) {
//     initCategoria();
//   }
//   if (path.includes("produto.html")) {
//     initProduto();
//   }
//   if (path.includes("pesquisa.html")) {
//     initSearch();
//   }
// });