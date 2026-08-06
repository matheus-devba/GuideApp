const EventoRepository = require("../repositories/eventos.repository.js");

class EventoService {

  async registrarEvento(dados) {
    return await EventoRepository.create(dados);
  }

  async listarEventos() {
    return await EventoRepository.findAll();
  }

}

module.exports = new EventoService();