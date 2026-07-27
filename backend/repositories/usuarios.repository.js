const pool = require("../database/connection.js")

class UsuariosRepository {
    async buscarTodos() {
        const { rows } = await pool.query(`
            SELECT * FROM usuarios
            ORDER BY id
            `)
        return rows
    }
    async buscarUsuarios() {
        const { rows } = await pool.query(`
            SELECT * FROM usuarios
            WHERE tipo = 'user'
            ORDER BY id
            `)
        return rows
    }

    async buscarAdm() {
        const { rows } = await pool.query(`
            SELECT * FROM usuarios
            WHERE tipo = "adm"
            ORDER BY id
            `)
        return rows
    }

    async buscarUsuario(id) {
        const { rows } = await pool.query(`
            SELECT * FROM usuarios
            WHERE id = $1 AND tipo = 'user'
            `,[id])
            
        return rows[0]
    }

    async criarAdm(dados) {
        const { rows } = await pool.query(`
            INSERT INTO usuarios (nome, email, password_hash, tipo, ativo, created_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            RETURNING *;
            `,
            [
                dados.nome,
                dados.email,
                dados.password_hash,
                dados.tipo,
                dados.ativo,
            ]
        )
        
        return rows[0]
    }

    async criarUsuario(dados) {
        const { rows } = await pool.query(`
            INSERT INTO usuarios (nome, email, password_hash, tipo, ativo, loja_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *;
            `,
            [
                dados.nome,
                dados.email,
                dados.password_hash,
                dados.tipo,
                dados.ativo,
                dados.loja_id
            ]
        )
        
        return rows[0]
    }

    async editarAdm(id, dados) {
    const { rows } = await pool.query(`
        UPDATE usuarios 
        SET 
            nome = $2, 
            email = $3, 
            password_hash = $4
            tipo = $5
            ativo = $6
            WHERE id = $1
        
        RETURNING *;
        `,
        [   
            id,
            dados.nome,
            dados.email,
            dados.password_hash,
            dados.tipo,
            dados.ativo,
        ]
    );

        
        return rows[0]
    }

    async editarUsuario(id, dados) {
    const { rows } = await pool.query(`
        UPDATE usuarios 
        SET 
            nome = $2, 
            email = $3,
            tipo = $4,
            ativo = $5
            WHERE id = $1
        
        RETURNING *;
        `,
        [   
            id,
            dados.nome,
            dados.email,
            dados.tipo,
            dados.ativo,
        ]
    );

        
        return rows[0]
    }
    async editarUsuario(id, dados) {
    const { rows } = await pool.query(`
        UPDATE usuarios 
        SET 
            nome = $2, 
            email = $3,
            tipo = $4,
            ativo = $5
            WHERE id = $1
        
        RETURNING *;
        `,
        [   
            id,
            dados.nome,
            dados.email,
            dados.tipo,
            dados.ativo,
        ]
    );

        
        return rows[0]
    }

    async excluirUsuario(id) {
        const { rows } = await pool.query(`
            DELETE FROM usuarios
            WHERE id = $1
            RETURNING *
            `,
            [  id ]
        )
        
        return rows[0]
    }

    
    async buscarPorEmail(email) { // PARA LOGIN
        const { rows } = await pool.query(`
            SELECT * FROM usuarios
            WHERE email = $1
        `, [email]);
        return rows[0];
    }
}


module.exports = new UsuariosRepository();