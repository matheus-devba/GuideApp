const pool = require("../database/connection.js")

class ProdutosRepository {
    async buscarAtivos () {
        // desestruturação do pool com {rows}
        const { rows } = await pool.query(` 
            SELECT * FROM produtos 
            WHERE ativo = true
            ORDER BY id desc
        `)

        return rows
    }
    async buscarDestaques () {
        // desestruturação do pool com {rows}
        const { rows } = await pool.query(` 
            SELECT * FROM produtos 
            WHERE destaque = true
            ORDER BY id desc
        `)

        return rows
    }

    async buscarPorTermoPorLoja(id_loja, query, apenasDestaques = false) {
         // Base da busca sempre por loja e somente ativos
        const busca = `%${String(query || "").trim()}%`
        const params = [id_loja]
        const filtros = [
           "loja_id = $1",
           "ativo = true"
      ]

      // Filtro opcional para buscar só destaque
       if (apenasDestaques) {
            filtros.push("destaque = true")
        }

        // Se existir texto, filtra também pelo nome
      if (busca) {
          filtros.push(`LOWER(nome) LIKE LOWER($${params.length + 1})`)
           params.push(`%${busca}%`)
       }

       const whereClause = `WHERE ${filtros.join(" AND ")}`

        if (!busca || busca === "%%") return []

        const { rows } = await pool.query(`
            SELECT *
            FROM produtos
            ${whereClause}
            ORDER BY id DESC
            `, params)

        return rows
    }

    async buscarTodos() {
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            ORDER BY id desc
            `)

        return rows
    }

    async buscarTodosOcultos() {
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE ativo = false
            ORDER BY id desc
            `)

        return rows
    }

    async buscarProduto(id) { //tirei o ativo = true
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE id = $1
            `,
            [id]
        )
        return rows[0]
    } 

    async buscarProdutoAtivo(id) { 
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE id = $1
            AND ativo = true
            `,
            [id]
        )
        return rows[0]
    } 
    
    async buscarAtivosPorLoja(id_loja) {
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE loja_id = $1
            AND ativo = true
            ORDER BY id desc
            `,
            [id_loja]
        )
        return rows
    } 
    async buscarPorCategoria(categoria_id, loja_id) {
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE loja_id = $2 AND categoria_id = $1 AND ativo = true
            ORDER BY id ASC 
            `,
            [loja_id, categoria_id]
        )
        return rows
    } 
    async buscarDestaquesPorLoja(id_loja) {
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE loja_id = $1
            AND destaque = true
            AND ativo = true
            ORDER BY id desc
            `,
            [id_loja]
        )
        return rows
    } 

    async buscarOcultosPorLoja(id_loja) {
        const { rows } = await pool.query(`
            SELECT * FROM produtos
            WHERE loja_id = $1
            AND ativo = false
            ORDER BY id desc
            `,
            [id_loja]
        )

        return rows
    } 


    async criar(produto) {
        const { rows } = await pool.query(`
        INSERT INTO produtos
        (
            loja_id,
            categoria_id,
            nome,
            preco_normal,
            preco_promocional,
            descricao,
            destaque,
            ativo,
            created_at
        )

        VALUES

        ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)

        RETURNING *

        `,
        [   produto.loja_id,
            produto.categoria_id,
            produto.nome,
            produto.preco_normal,
            produto.preco_promocional,
            produto.descricao,
            produto.destaque,
            produto.ativo
        ]

    )
    return rows[0]
    }

    async atualizar(id, produto) {
        const { rows } = await pool.query(`
            UPDATE produtos
            SET
                categoria_id = $2,
                nome = $3,
                preco_normal = $4,
                preco_promocional= $5,
                descricao = $6,
                destaque = $7,
                forma_de_pagamento = $8,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1
            RETURNING *
            `,
            [
                id,
                produto.categoria_id,
                produto.nome,
                produto.preco_normal,
                produto.preco_promocional,
                produto.descricao,
                produto.destaque,
                produto.forma_de_pagamento
            ]
        )
        return rows[0]
    }

    async desativar(id) {
        const { rows } = await pool.query(`
            UPDATE produtos
            SET ativo = false
            WHERE id = $1
            RETURNING *
            `,
            
            [id]
        )
        return rows[0]
    }

    async ativar(id) {
        const { rows } = await pool.query(`
            UPDATE produtos
            SET ativo = true
            WHERE id = $1
            RETURNING *
            `,
            
            [id]
        )
        return rows[0]
    }
    async destacar(id, status) {
        const { rows } = await pool.query(`
            UPDATE produtos
            SET destaque = $2
            WHERE id = $1
            RETURNING *
            `,
            
            [id, status]
        )
        return rows[0]
    }

    async addView(id) {
        const { rows } = await pool.query(`
            UPDATE produtos
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
            UPDATE produtos
            SET interesses = interesses + 1
            WHERE id = $1
            RETURNING *
            `,
            
            [id]
        )
        return rows[0]
    }

    async deletar(id) {
        const { rows } = await pool.query(`
            DELETE FROM produtos
            WHERE id = $1
            RETURNING *
            `,
            
            [id]
        )

        return rows[0]
    }


}

module.exports = new ProdutosRepository();