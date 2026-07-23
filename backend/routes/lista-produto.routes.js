const ListaProdutoController = require("../controllers/lista-produto.controller.js")
const express = require("express")
const router = express.Router()

router.get("/lista/:id", ListaProdutoController.buscarProdutosEmLista)
router.get("/update/:id", ListaProdutoController.atualizar)



module.exports = router