const express = require("express");

const router = express.Router();

const EventoController = require("../controllers/eventos.controller.js");

router.post("/newEvent", EventoController.create);

router.get("/:id", EventoController.findAllPorLoja);

router.get("/", EventoController.findAll);

module.exports = router;