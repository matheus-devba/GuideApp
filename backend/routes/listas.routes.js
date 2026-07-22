const ListasController = require("../controllers/listas.controller.js")
const express = require("express")
const router = express.Router()

router.get("/", ListasController.buscarListas)



module.exports = router