const pool = require("../database/connection.js")
class ListasRepository {
    async buscarListas () {
        const { rows } = await pool.query(`
            SELECT * FROM listas
            `)
        return rows
    }
    async buscarListaPorId (id) {
        const { rows } = await pool.query(`
            SELECT * FROM listas
            WHERE id = $1
            `,
            [id]
        )
        return rows[0]
    }
    async atualizar (id, nome) {
        const { rows } = await pool.query(`
            UPDATE listas
            SET nome = $1
            WHERE id = $2
            RETURNING *
            `,
            [nome, id]
        )
        return rows[0]
    }

  
}
module.exports = new ListasRepository();