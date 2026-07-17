import { initClientes } from "./clientes.js"
import { initCliente } from "./cliente.js"
import { initNewClient } from "./formCliente.js"

const path = window.location.pathname

if (path === "/adm/clientes/new") {
  initNewClient()
} else if (path === "/adm/clientes") {
  initClientes()
} else if (/^\/adm\/clientes\/\d+$/.test(path)) {
  initCliente()
}