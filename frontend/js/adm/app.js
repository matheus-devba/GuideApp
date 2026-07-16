import { initClientes } from "./clientes.js"
import { initCliente } from "./cliente.js"

const path = window.location.pathname

if (path.startsWith("/adm/clientes")) {
  initClientes()
}
if (path.startsWith("/adm/clientes/")) {
  initCliente()
}