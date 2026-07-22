const pool = require("../database/connection.js")

async function seedListas() {

    await pool.query(`
        INSERT INTO listas
        (
            loja_id,
            nome

        )

        VALUES

        (
            '3',
            'Kit Skin Care'
          
        ),
        (
            '3',
            'Looks para o dia a dia'
        );
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedListas
