const path = require("path")
const express = require("express")
const cors = require("cors")



const hash = require("./routes/criarHash.routes.js")
const lojaRoutes = require("./routes/loja.routes.js")
const categoriasRoutes = require("./routes/categorias.routes.js")
const produtosRoutes = require("./routes/produtos.routes.js")
const produtoImagensRoutes = require("./routes/produto-imagens.routes.js")
const listasRoutes = require("./routes/listas.routes.js")
const listaProdutoRoutes = require("./routes/lista-produto.routes.js")
const usuariosRoutes = require("./routes/usuarios.routes.js")
const eventoRoutes = require("./routes/eventos.routes");

const app = express()

app.use(cors({
  origin: [
    "https://guideapp.onrender.com",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
}))

app.use(express.json())

app.use(express.static(path.join(__dirname, "..", "frontend")))



app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/usuarios/gerar-hash", hash);

app.use("/api/lojas", lojaRoutes);

app.use("/api/categorias", categoriasRoutes)

app.use("/api/produtos", produtosRoutes)

app.use("/api/produto_imagens", produtoImagensRoutes)

app.use("/api/listas", listasRoutes)

app.use("/api/lista-produtos", listaProdutoRoutes)

app.use("/api/usuarios", usuariosRoutes)

app.use("/eventos", eventoRoutes)

app.get("/health", (req, res) => {
  res.status(200).send("OK")
})


//emulação front end

// CONSUMER
app.get("/lojas", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "lojas.html"))
})

app.get("/lojas/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "loja.html"))
})

app.get("/produtos/merchant/new", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "formProduto.html"))
})


app.get("/produtos/update/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "formProduto.html"))
})


app.get("/produtos/merchant/:id", (req, res) => { // tem que ser merchant/produtos/id
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "produto.html"))
})


app.get("/listas/merchant/new", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "formLista.html"))
})


app.get("/listas/merchant/:id", (req, res) => { // tem que ser merchant/listas/id
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "lista.html"))
})

app.get("/lista-produto/update/:id", (req, res) => { 
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "formLista.html"))
})

app.get("/produtos/:id", (req, res) => {
    const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "produto.html"))
})

app.get("/listas/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "lista.html"))
})

app.get("/destaques/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "destaques.html"))
})

app.get("/categorias/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "categoria.html"))
})

app.get("/consumer/pesquisa/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "pesquisa.html"))
})




app.get("/adm/clientes", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "clientes.html"))
})

app.get("/adm/clientes/new", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "formNewClient.html"))
})

app.get("/adm/clientes/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "cliente.html"))
})



app.get("/adm/categorias", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "categorias.html"))
})

app.get("/adm/categorias/new", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "formNewCategoria.html"))
})

app.get("/adm/categorias/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "formNewCategoria.html"))
})



app.get("/adm/usuarios", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "usuarios.html"))
})

app.get("/adm/usuarios/new", (req, res) => { // tem que ser merchant/listas/id

  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "formNewUser.html"))

})
app.get("/adm/root/new", (req, res) => { // tem que ser merchant/listas/id

  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "formNewUser.html"))
})

app.get("/adm/usuarios/:id", (req, res) => { // tem que ser merchant/listas/id
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }

  res.sendFile(path.join(__dirname, "..", "frontend", "adm", "usuario.html"))
})


app.get("/merchant/login", (req, res) => { 

  res.sendFile(path.join(__dirname, "..", "frontend", "merchant", "login.html"))
})


module.exports = app
