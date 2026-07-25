const seedLojas = require("./loja.seed.js")
const seedCategorias = require("./categorias.seed.js")
const seedNicho = require("./nicho.seed.js")
const seedProdutos = require("./produtos.seed.js")
const seedProdutoImagens = require("./produto-imagens.seed.js")
const seedListas = require("./listas.seed.js")
const seedListaProduto = require("./lista-produto.seed.js")
const seedUsuarios = require("./usuarios.seed.js")

async function run() {
    // await seedNicho()
    // await seedLojas()
    // await seedCategorias()
    // await seedProdutos()
    // await seedProdutoImagens()
    // await seedListas()
    // await seedListaProduto()
    await seedUsuarios()
   
    console.log("Dados inseridos com sucesso")
    process.exit(0)
}

run()
