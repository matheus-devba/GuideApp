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

    async buscarIdPorListaId (lista_id) {
        // desestruturação do pool com {rows}
        const { rows } = await pool.query(` 
            SELECT id FROM lista_produto 
            WHERE lista_id = $1
        `,
        [lista_id]
    )

        return rows[0]
    }

 async atualizar(lista_id, produtos) {
  // Garante que só vai entrar com uma lista de IDs válidos
  const produtoIds = (Array.isArray(produtos) ? produtos : [])
    .map((item) => Number(item?.produto_id || item?.id || item))
    .filter((id) => Number.isInteger(id) && id > 0)
    .filter((value, index, arr) => arr.indexOf(value) === index); // remove duplicados

  const client = await pool.connect();

  try {
    // Começa a transação para não deixar estado inconsistente
    await client.query("BEGIN");

    // 1) remove vínculos antigos da lista
    await client.query(
      "DELETE FROM lista_produto WHERE lista_id = $1",
      [lista_id]
    );

    const resultados = [];

    // 2) insere a nova lista de produtos
    for (const produtoId of produtoIds) {
      const { rows } = await client.query(
        `
        INSERT INTO lista_produto (lista_id, produto_id)
        VALUES ($1, $2)
        RETURNING *
        `,
        [lista_id, produtoId]
      );
      resultados.push(rows[0]);
    }

    // Tudo certo, confirma
    await client.query("COMMIT");

    return {
      id: Number(lista_id),
      lista_id: Number(lista_id),
      produtos: resultados
    };
  } catch (error) {
    // Em caso de erro, desfaz
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Sempre libera conexão
    client.release();
  }
}

}

module.exports = new ListaProdutoRepository();
