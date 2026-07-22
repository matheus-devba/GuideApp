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
 async criarImagens (produto_id, imagens) {
    const resultados = []

    for (const imagem of imagens) {
      const { rows } = await pool.query(`
        INSERT INTO produto_imagens (
          produto_id,
          url,
          ordem,
          created_at
        )
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `, [
        produto_id,
        imagem.url,
        imagem.ordem
      ])

      resultados.push(rows[0])
    }

    return resultados
}
}

module.exports = new ProdutoImagensRepository();