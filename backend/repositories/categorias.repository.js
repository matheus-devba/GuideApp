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
    async buscarPorNicho(id) {
        const { rows } = await pool.query(`
            SELECT * FROM categorias
            WHERE nicho_id = $1
            ORDER BY nome asc
            `,[id])
            
        return rows
    }

    async criarCategoria(categoria) {
        const { rows } = await pool.query(`
            INSERT INTO categorias (icone_url, nome, nicho_id, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *;
            `,
            [
                categoria.icon_url,
                categoria.nome,
                categoria.nicho_id
            ]
        )
        
        return rows[0]
    }

    async editarCategoria(id, categoria) {
    const { rows } = await pool.query(`
        UPDATE categorias 
        SET 
            icone_url = $2, 
            nome = $3, 
            nicho_id = $4
            WHERE id = $1
        
        RETURNING *;
        `,
        [   
            id,
            categoria.icon_url,
            categoria.nome,
            categoria.nicho_id
        ]
    );

        
        return rows[0]
    }

    async excluirCategoria(id) {
        const { rows } = await pool.query(`
            DELETE FROM categorias
            WHERE id = $1
            RETURNING *
            `,
            [  id ]
        )
        
        return rows[0]
    }
}


module.exports = new CategoriasRepository();