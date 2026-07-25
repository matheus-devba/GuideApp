const pool = require("../database/connection.js")

async function seedUsuarios() {

    await pool.query(`
        INSERT INTO usuarios
        (
            loja_id,
            nome,
            email,
            password_hash,
            tipo,
            ativo

        )

        VALUES

        ('3',
        'Marineide Alves',
        'mismarysantos@gmail.com',
        '$2b$10$r9I1XWfTzM8Yx7Yv4uVqOuXzKj1w8F7K5mR2e8vT9yBc5D6E7f8gG',
        'user',
        true)
    
    `);

    console.log("Seed executado!");

    process.exit();
}
module.exports = seedUsuarios
