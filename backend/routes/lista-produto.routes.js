const ListaProdutoController = require("../controllers/lista-produto.controller.js")
const express = require("express")
const router = express.Router()

router.get("/lista/:id", ListaProdutoController.buscarProdutosEmLista)
router.put("/update/:id", ListaProdutoController.atualizar)
router.get("/buscarId/:id", ListaProdutoController.buscarIdPorListaId) 



module.exports = router
