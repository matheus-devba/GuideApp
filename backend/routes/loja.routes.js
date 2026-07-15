const LojaController = require("../controllers/loja.controller.js")
const express = require("express")
const router = express.Router()

router.get("/", LojaController.buscarTodas)
router.post("/new", LojaController.criar)
router.get("/:id", LojaController.buscarPorId)
router.put("/update/:id", LojaController.atualizar)
router.patch("/hidden/:id", LojaController.ocultar)
router.patch("/active/:id", LojaController.ativar)

module.exports = router