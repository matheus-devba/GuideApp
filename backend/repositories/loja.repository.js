const pool = require("../database/connection.js");

class LojaRepository {
    async buscarTodas() {

    const { rows } = await pool.query(`
        SELECT *
        FROM lojas
        WHERE ativo = true
        ORDER BY id;
    `);

    return rows;
}

    async buscarPorId(id) {
        const { rows } = pool.query(`
            SELECT * FROM lojas
            WHERE id = $1
            `,
            [id]
        ),
            
        return rows[0]
    }

    async criarLoja(loja) {
        const { rows } = pool.query(`
            INSERT INTO lojas
            (
            nome,
            endereco,
            telefone,
            nicho,
            logo_url,
            banner_url,
            descricao,
            whatsapp,
            ativo
        )

        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )

        RETURNING *;
        `,
        [
            loja.nome,
            loja.endereco,
            loja.telefone,
            loja.nicho,
            loja.logo_url,
            loja.banner_url,
            loja.descricao,
            loja.whatsapp,
            loja.ativo
        ]
    );
            
        return rows[0]
    }
    
    async atualizar (id, loja) {
        const { rows } = pool.query(`
            INSERT INTO lojas WHERE ID=$1
            (
            nome,
            endereco,
            telefone,
            nicho,
            logo_url,
            banner_url,
            descricao,
            whatsapp,
            ativo
        )

        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
        )

        RETURNING *;
        `,
        [
            id,
            loja.nome,
            loja.endereco,
            loja.telefone,
            loja.nicho,
            loja.logo_url,
            loja.banner_url,
            loja.descricao,
            loja.whatsapp,
            loja.ativo
        ]

    );
        return rows[0]
    }

    async desativar (id) {
        const { rows } = pool.query(`
            UPDATE lojas 
            SET ativo = false
            WHERE ID=$1
            RETURNING *;
        `,
        [id]
    );
    }
}

module.exports = new LojaRepository();