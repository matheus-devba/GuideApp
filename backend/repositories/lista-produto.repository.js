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

 async atualizar (lista_id, produtos) {
    const resultados =  []

    for (const produto of produtos) {
      const { rows } = await pool.query(`
        UPDATE lista_produto (
          lista_id,
          produto_id
        )
        SET ($1, $2)
        RETURNING *
      `, [
        lista_id,
        produto.produto_id
      ])

      resultados.push(rows[0])
    }
        return resultados
    }


}

module.exports = new ListaProdutoRepository();