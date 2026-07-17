const pool = require("../database/connection.js");

class LojaRepository {
    async buscarAtivas() {

    const { rows } = await pool.query(`
        SELECT *
        FROM lojas
        WHERE ativo = true
        ORDER BY id;
    `);

    return rows;
    }

    async buscarTodas() {

    const { rows } = await pool.query(`
        SELECT *
        FROM lojas
        ORDER BY id;
    `);

    return rows;
    }

    async buscarPorId(id) {
        const { rows } = await pool.query(`
            SELECT * FROM lojas
            WHERE id = $1
            `,
            [id]
        )
            
        return rows[0]
    }

    async criarLoja(loja) {
        const { rows } = await pool.query(`
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
            ativo,
            created_at
        )

        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9, CURRENT_TIMESTAMP
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
    const { rows } = await pool.query(`
        UPDATE lojas 
        SET 
            nome = $2,
            endereco = $3,
            telefone = $4,
            nicho = $5,
            logo_url = $6,
            banner_url = $7,
            descricao = $8,
            whatsapp = $9,
            ativo = $10,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
    `,
    [
        id,               // $1
        loja.nome,        // $2
        loja.endereco,    // $3
        loja.telefone,    // $4
        loja.nicho,       // $5
        loja.logo_url,    // $6
        loja.banner_url,  // $7
        loja.descricao,   // $8
        loja.whatsapp,    // $9
        loja.ativo        // $10
    ]

    );
        return rows[0]
    }

    async desativar (id) {
        const { rows } = await pool.query(`
            UPDATE lojas 
            SET ativo = false
            WHERE ID=$1
            RETURNING *;
        `,
        [id]
    );
    }

    async ativar (id) {
        const { rows } = await pool.query(`
            UPDATE lojas 
            SET ativo = true
            WHERE ID=$1
            RETURNING *;
        `,
        [id]
    );

    return rows[0]
    }
}

module.exports = new LojaRepository();