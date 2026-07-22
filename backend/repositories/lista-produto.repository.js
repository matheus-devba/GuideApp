const pool = require("../database/connection.js")
class ListaProdutoRepository {
 async buscarProdutosEmLista (lista_id) {
        // desestruturação do pool com {rows}
        const { rows } = await pool.query(` 
            SELECT produto_id FROM lista_produto 
            WHERE lista_id = $1
            ORDER BY created_at desc
        `,
        [lista_id]
    )

        return rows
    }


}

module.exports = new ListaProdutoRepository();