// backend/routes/criarHash.routes.js
const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { senha } = req.body

    if (!senha) {
      return res.status(400).json({ error: "Senha é obrigatória" })
    }

    const hash = await bcrypt.hash(senha, 10)
    return res.status(200).json({ hash })
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao gerar hash" })
  }
})

module.exports = router