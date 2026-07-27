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

    // 1. Busca a maior ordem já cadastrada para esse produto
    const { rows: maxRows } = await pool.query(
      `SELECT COALESCE(MAX(ordem), 0) as max_ordem FROM produto_imagens WHERE produto_id = $1`,
      [produto_id]
    );
    
    // Define a próxima ordem disponível
    let proximaOrdem = Number(maxRows[0].max_ordem) + 1;

    // 2. Insere as novas imagens incrementando a ordem a partir da última
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
        proximaOrdem
      ]);

      proximaOrdem++;
      resultados.push(rows[0]);
    }

    return resultados;
}

  async deletarPorUrl(produto_id, url) {
    const { rows } = await pool.query(`
      DELETE FROM produto_imagens 
      WHERE produto_id = $1 AND url = $2
      RETURNING *
    `, [produto_id, url]);
    return rows[0];
  }
}

module.exports = new ProdutoImagensRepository();