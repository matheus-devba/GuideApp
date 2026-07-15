const path = require("path")
const express = require("express")
const lojaRoutes = require("./routes/loja.routes.js")

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "frontend")))


app.get("/lojas", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "lojas.html"))
})

app.get("/lojas/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "consumer", "loja.html"))
})

// API separada da página
app.use("/api/lojas", lojaRoutes)

module.exports = app