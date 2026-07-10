import { initCliente } from "./cliente.js";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("cliente.html")) {
    initCliente();
  }
})