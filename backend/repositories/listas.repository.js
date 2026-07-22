const pool = require("../database/connection.js")
class ListasRepository {
    async buscarListas () {
        const { rows } = await pool.query(`
            SELECT * FROM listas
            `)
        return rows
    }
}
module.exports = new ListasRepository();