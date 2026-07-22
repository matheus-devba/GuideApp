const ProdutoController = require('../controllers/produtos.controller.js')
const express = require("express")
const router = express.Router()


router.post("/new", ProdutoController.criar)
router.put("/update/:id", ProdutoController.atualizar)
router.get("/ativosAll", ProdutoController.buscarAtivos)
router.get("/:id", ProdutoController.buscarProduto)
router.get("/ativos/:id", ProdutoController.buscarAtivosPorLoja)
router.get("/ocultos/:id", ProdutoController.buscarOcultosPorLoja)
router.patch("/hidden/:id", ProdutoController.desativar)
router.patch("/active/:id", ProdutoController.ativar)
router.delete("/delete/:id", ProdutoController.deletar)

module.exports = router