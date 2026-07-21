const seedLojas = require("./loja.seed.js")
const seedCategorias = require("./categorias.seed.js")
const seedNicho = require("./nicho.seed.js")
const seedProdutos = require("./produtos.seed.js")

async function run() {
    // await seedNicho()
    // await seedLojas()
    // await seedCategorias()
    // await seedProdutos()
   
    console.log("Dados inseridos com sucesso")
    process.exit(0)
}

run()
