const pool = require("../database/connection.js")

async function seedProdutoImagens() {

    await pool.query(`
        INSERT INTO produto_imagens
        (
            produto_id,
            url,
            ordem

        )

        VALUES

        (
            '9',
            '/uploads/produtos/combo-nativa.jpeg',
            '1'
        ),
        (
            '9',
            '/uploads/produtos/combo-nativa-2.webp',
            '2'
        );
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedProdutoImagens
