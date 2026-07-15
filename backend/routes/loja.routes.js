const LojaController = require("../controllers/loja.controller.js")
const express = require("express")
const router = express.Router()

router.get("/lojas", LojaController.buscarTodas)
router.get("/lojas:id", LojaController.buscarPorId)
router.get("/lojas/new", LojaController.criar)
router.get("/lojas/update:id", LojaController.atualizar)
router.get("/lojas/hidden:id", LojaController.ocultar)

module.exports = router