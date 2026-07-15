const path = require("path")
const { Pool } = require("pg")
const dotenv = require("dotenv")

dotenv.config({
    path: path.resolve(__dirname, "..", "config", ".env"),
})

const pool = new Pool({
    host: process.env.DB_HOST,
    user: "postgres",
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

pool.query("SELECT NOW()", (err, res) => {
    if (!err) {
        console.log(res.rows[0])
        return
    }

    console.log("could not connect to postgres:", err)
})

module.exports = pool

