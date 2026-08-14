const express = require("express");

const router = express.Router();

const EventoController = require("../controllers/eventos.controller.js");

router.post("/newEvent", EventoController.create);

router.get("/:id", EventoController.findAllPorLoja);

module.exports = router;