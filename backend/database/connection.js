const path = require("path")
const { Pool } = require("pg")
const dotenv = require("dotenv")

dotenv.config({
  path: path.resolve(__dirname, "..", "config", ".env"),
})

const isProd = process.env.NODE_ENV === "production" || !!process.env.DATABASE_URL

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      port: Number(process.env.DB_PORT || 5432),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "guide",
      ssl: isProd ? { rejectUnauthorized: false } : undefined,
    })

pool.query("SELECT NOW()", (err, res) => {
  if (!err) return console.log(res.rows[0])
  console.log("could not connect to postgres:", err)
})

module.exports = pool