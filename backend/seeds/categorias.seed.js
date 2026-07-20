const pool = require("../database/connection.js")

async function seedCategorias() {

    await pool.query(`
        INSERT INTO categorias
        (
            icone_url,
            nome,
            nicho_id,
            ativo

        )

        VALUES

        (
            '/uploads/icons_categorias/combo-nativa.jpeg',
            'Hidratantes',
            '1',
            true
        );
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedCategorias
