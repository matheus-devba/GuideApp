import { initClientes } from "./clientes.js"
import { initCliente } from "./cliente.js"
import { initNewClient } from "./formCliente.js"

import { initNewCategoria } from "./formCategoria.js"
import { initCategorias } from "./categorias.js"
import { initCategoria } from "./categoria.js"

import { initUsuarios } from "./usuarios.js"
import { initUsuario } from "./usuario.js"
import { initNewUsuario, initNewAdm } from "./formUsuario.js"
import { initHome } from "./home.js"


const path = window.location.pathname

if (path === "/adm/clientes/new") {
  initNewClient()
} else if (path === "/adm/clientes") {
  initClientes()
} else if (/^\/adm\/clientes\/\d+$/.test(path)) {
  initCliente()
}


if (path === "/adm/categorias/new") {
  initNewCategoria()
} else if (path === "/adm/categorias") {
  initCategorias()
} else if (/^\/adm\/categorias\/\d+$/.test(path)) {
  initCategoria()
}

if (path === "/adm/usuarios") {
  initUsuarios()
} else if (path === "/adm/usuarios/new") {
  initNewUsuario()
} else if (path === "/adm/root/new") {
  initNewAdm()
} else if (/^\/adm\/usuarios\/\d+$/.test(path)) {
  initUsuario()
}

if (path === "/adm/home" || path.includes("/adm/home.html")) {
  initHome()
}