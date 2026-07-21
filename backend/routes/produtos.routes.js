const ProdutoController = require('../controllers/produtos.controller.js')
const express = require("express")
const router = express.Router()


router.post("/new", ProdutoController.criar)
router.put("/update/:id", ProdutoController.atualizar)
router.get("/ativos/:id", ProdutoController.buscarAtivosPorLoja)
router.get("/ocultos/:id", ProdutoController.buscarOcultosPorLoja)
router.get("/hidden/:id", ProdutoController.desativar)
router.patch("/active/:id", ProdutoController.ativar)
router.patch("/delete/:id", ProdutoController.deletar)