const pool = require("../database/connection.js")
class ProdutoImagensRepository {
 async buscarImagens (produto_id) {
        // desestruturação do pool com {rows}
        const { rows } = await pool.query(` 
            SELECT * FROM produto_imagens 
            WHERE produto_id = $1
            ORDER BY ordem
        `,
        [produto_id]
    )

        return rows
    }
 async buscarPrimeiraImagem (produto_id) {
        // desestruturação do pool com {rows}
        const { rows } = await pool.query(` 
            SELECT url FROM produto_imagens 
            WHERE produto_id = $1
            ORDER BY ordem
            LIMIT 1
        `,
        [produto_id]
    )

        return rows[0]
    }


}

module.exports = new ProdutoImagensRepository();