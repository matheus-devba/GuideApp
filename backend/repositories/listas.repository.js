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
    async criar (dados) {
        const { rows } = await pool.query(`
            INSERT INTO listas (loja_id ,nome)
            VALUES
            ($1, $2)
            RETURNING *
            `,
            [   dados.loja_id,
                dados.nome
            ]
        )
        return rows[0]
    }
    async deletar (id) {
        const { rows } = await pool.query(`
            DELETE FROM listas
            WHERE id = $1
            RETURNING *
            `,
            [id]
        )
        return rows[0]
    }
    async ocultar (id) {
        const { rows } = await pool.query(`
            UPDATE listas
            SET ativo = true
            WHERE id = $1
            RETURNING *
            `,
            [id]
        )
        return rows[0]
    }

  
}
module.exports = new ListasRepository();