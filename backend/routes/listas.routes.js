const ListasController = require("../controllers/listas.controller.js")
const express = require("express")
const router = express.Router()

router.get("/", ListasController.buscarListas)
router.get("/merchant/:id", ListasController.buscarListaPorId) // tem que vim merchant/lista/:id



module.exports = router