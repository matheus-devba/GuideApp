const ProdutoController = require('../controllers/produtos.controller.js')
const express = require("express")
const router = express.Router()


router.post("/merchant/new", ProdutoController.criar) //nao pode ser assim por conta da categoria. tem que vim com o id do merchant
router.put("/update/:id", ProdutoController.atualizar)
router.get("/ativosAll", ProdutoController.buscarAtivos)
router.get("/:id", ProdutoController.buscarProduto)
router.get("/ativos/:id", ProdutoController.buscarAtivosPorLoja)
router.get("/ocultos/:id", ProdutoController.buscarOcultosPorLoja)
router.patch("/hidden/:id", ProdutoController.desativar)
router.patch("/active/:id", ProdutoController.ativar)
router.delete("/delete/:id", ProdutoController.deletar)

module.exports = router