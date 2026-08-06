const EventoService = require("../services/eventos.service.js");

class EventoController {

  async create(req, res) {
    try {

      const evento = await EventoService.registrarEvento(req.body);

      return res.status(201).json(evento);

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }

  async findAll(req, res) {

    try {

      const eventos = await EventoService.listarEventos();

      return res.json(eventos);

    } catch (error) {

      return res.status(500).json({
        message: error.message
      });

    }

  }

}

module.exports = new EventoController();