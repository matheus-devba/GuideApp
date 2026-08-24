const path = require("path")
const express = require("express")
const cors = require("cors")
const ProdutosService = require("./services/produtos.service.js");
const ProdutoImagensService = require("./services/produto-imagens.service.js");

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

app.use("/api/eventos", eventoRoutes)

app.get("/health", (req, res) => {
  res.status(200).send("OK")
})


//emulação front end

// CONSUMER
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "home.html"))
})
app.get("/lojasAll", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "lojas.html"))
})
app.get("/pesquisa", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "produtos.html"))
})

app.get("/lojasAll/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "lojas.html"))
})

app.get("/promocoesAll/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "promocoes.html"))
})

app.get("/listasAll/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "listas.html"))
})


app.get("/lojas/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "loja.html"))
})
app.get("/categorias/guide/:id", (req, res) => {
  const { id } = req.params

  if (!/^\d+$/.test(id)) {
    return res.status(404).send("Página não encontrada")
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "categorias.html"))
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





app.set("trust proxy", 1);

app.get("/share/produto/:id", async (req, res) => {
// Trata HTTPS quando rodando atrás de proxies (Render, Heroku, Nginx)
  const produtoId = Number(req.params.id);

  if (!Number.isInteger(produtoId) || produtoId <= 0) {
    return res.status(400).send("ID de produto inválido");
  }

  try {
    const [produto, imagem] = await Promise.all([
    ProdutosService.buscarProdutoAtivo(produtoId),
    ProdutoImagensService.buscarPrimeiraImagem(produtoId)
  ]);

    if (!produto) {
      return res.status(404).send("Produto não encontrado");
    }

    const baseUrl = (
      process.env.PUBLIC_BASE_URL ||
      `${req.protocol}://${req.get("host")}`
    ).replace(/\/+$/, "");


    if (!produto) return res.status(404).send("Produto não encontrado");


    const titulo = String(produto.nome || "Produto no Guide");

    const descricao = String(
      produto.descricao ||
      "Dê uma olhada nesse produto que encontrei no Guide!"
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

    const imagemUrl =
      imagem?.url ||
      `${baseUrl}/assets/images/default.webp`;

    const shareUrl =
      `${baseUrl}/share/produto/${produtoId}` +
      `?loja_id=${produto.loja_id}`;

    const urlDestino =
      `${baseUrl}/produtos/${produtoId}` +
      `?loja_id=${produto.loja_id}` +
      `&produto_id=${produtoId}`;

    res.type("html").send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <title>${escapeHtml(titulo)}</title>
          <meta name="description" content="${escapeHtml(descricao)}">

          <meta property="og:type" content="website">
          <meta property="og:site_name" content="Guide">
          <meta property="og:locale" content="pt_BR">
          <meta property="og:title" content="${escapeHtml(titulo)}">
          <meta property="og:description" content="${escapeHtml(descricao)}">
          <meta property="og:image" content="${escapeHtml(imagemUrl)}">
          <meta property="og:image:secure_url" content="${escapeHtml(imagemUrl)}">
          <meta property="og:url" content="${escapeHtml(shareUrl)}">

          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${escapeHtml(titulo)}">
          <meta name="twitter:description" content="${escapeHtml(descricao)}">
          <meta name="twitter:image" content="${escapeHtml(imagemUrl)}">
        </head>

        <body>
          <p>
            Redirecionando...
            <a href="${escapeHtml(urlDestino)}">Clique aqui</a>
          </p>

          <script>
            window.location.replace(${JSON.stringify(urlDestino)});
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Erro ao gerar preview:", error);
    return res.status(500).send("Erro ao gerar preview");
  }
});

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}



//Merchant



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
