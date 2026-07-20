const pool = require("../database/connection.js")

class CategoriasRepository {
    async buscarTodas() {
        const { rows } = await pool.query(`
            SELECT * FROM categorias
            ORDER BY id
            `)
        return rows
    }

    async buscarPorId(id) {
        const { rows } = await pool.query(`
            SELECT * FROM categorias
            WHERE id = $1
            `,[id])
            
        return rows[0]
    }

    async criarCategoria(categoria) {
        const { rows } = await pool.query(`
            INSERT INTO categorias (icone_url, nome, created_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING *;
            `,
            [
                categoria.icone_url,
                categoria.nome
            ]
        )
        
        return rows[0]
    }

    async editarCategoria(id, categoria) {
        const { rows } = await pool.query(`
            UPDATE categorias (icone_url, nome)
            WHERE id = $1
            VALUES ($2, $3)
            
            RETURNING *;
            `,
            [   id,
                categoria.icone_url,
                categoria.nome
            ]
        )
        
        return rows[0]
    }

    async excluirCategoria(id) {
        const { rows } = await pool.query(`
            DELETE categoria
            WHERE id = $1
            RETURNING *
            `,
            [  id ]
        )
        
        return rows[0]
    }
}


module.exports = new CategoriasRepository();