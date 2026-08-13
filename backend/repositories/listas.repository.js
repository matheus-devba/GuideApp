const pool = require("../database/connection.js")
class ListasRepository {
    async buscarListasPorNicho (id) {
        const { rows } = await pool.query(`
            SELECT * FROM listas
            WHERE nicho_id = $1
            `, [id])
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
    async buscarLista (id) {
        const { rows } = await pool.query(`
            SELECT * FROM listas
            WHERE id = $1
            `,
            [id]
        )
        return rows[0]
    }
    
    async buscarListaPorLojaId (loja_id) {
        const { rows } = await pool.query(`
            SELECT * FROM listas
            WHERE loja_id = $1
            ORDER BY id DESC
            `,
            [loja_id]
        )
        return rows
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

    async addView(id) {
        const { rows } = await pool.query(`
            UPDATE listas
            SET views = views + 1
            WHERE id = $1
            RETURNING *
            `,
            
            [id]
        )
        return rows[0]
    }
    async addInteresse(id) {
        const { rows } = await pool.query(`
            UPDATE listas
            SET interesses = interesses + 1
            WHERE id = $1
            RETURNING *
            `,
            
            [id]
        )
        return rows[0]
    }



    async criar (dados) {
        const { rows } = await pool.query(`
            INSERT INTO listas (loja_id ,nome, nicho_id)
            VALUES
            ($1, $2, $3)
            RETURNING *
            `,
            [   dados.loja_id,
                dados.nome,
                dados.nicho_id
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