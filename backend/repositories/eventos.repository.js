const pool = require("../database/connection.js")

class EventoRepository {
  async create(evento) {
    // const { tipo_evento, loja_id, produto_id, lista_id } = evento;

    const result = await pool.query(
      `
      INSERT INTO eventos (
        tipo_evento,
        loja_id,
        produto_id,
        lista_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [evento.tipo_evento, evento.loja_id, evento.produto_id, evento.lista_id]
    );

    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(`
      SELECT *
      FROM eventos
      ORDER BY created_at DESC;
    `);

    return result.rows;
  }
}


module.exports = new EventoRepository();