const seedLojas = require("./loja.seed.js")

async function run() {
    await seedLojas()
    console.log("Dados inseridos com sucesso")
    process.exit(0)
}

run()
