const ListasController = require("../controllers/listas.controller.js")
const express = require("express")
const router = express.Router()

router.get("/", ListasController.buscarListas)
router.get("/merchant/:id", ListasController.buscarListaPorId) 
router.put("/merchant/update/:id", ListasController.atualizar) 
router.post("/merchant/new", ListasController.criar) 
router.delete("/merchant/deletar/:id", ListasController.deletar) 
router.patch("/merchant/ocultar/:id", ListasController.ocultar) 



module.exports = router