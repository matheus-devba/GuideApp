const ListasController = require("../controllers/listas.controller.js")
const express = require("express")
const router = express.Router()

router.get("/", ListasController.buscarListas)
router.get("/merchant/:id", ListasController.buscarListaPorId) 
router.put("/merchant/update/:id", ListasController.atualizar) 



module.exports = router