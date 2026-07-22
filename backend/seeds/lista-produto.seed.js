const pool = require("../database/connection.js")

async function seedListaProduto() {

    await pool.query(`
        INSERT INTO lista_produto
        (
            lista_id,
            produto_id

        )

        VALUES

        (
            '1',
            '9'
          
        ),
        (
            '2',
            '11'
        );
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedListaProduto
