const express = require("express");

const router = express.Router();

const EventoController = require("../controllers/eventos.controller.js");

router.post("/", EventoController.create);

router.get("/", EventoController.findAll);

module.exports = router;