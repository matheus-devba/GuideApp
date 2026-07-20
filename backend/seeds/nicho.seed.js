const pool = require("../database/connection.js")

async function seedNicho() {

    await pool.query(`
        INSERT INTO nicho
        (
            nome

        )

        VALUES

        ('Moda'),('Cosméticos');
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedNicho
