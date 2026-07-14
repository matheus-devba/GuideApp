const { Pool } = require("pg")
const dotenv = require("dotenv")

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: "postgres",
    port: process.env.DB_PORT,
    password: "12345",
    database: process.env.DB_NAME
})

pool.query("SELECT NOW()", (err, res) => {
    if(!err) {
        console.log(res.rows[0])
    } else {
        console.log(err)
    }

})

