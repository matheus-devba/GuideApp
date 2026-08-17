const EventoRepository = require("../repositories/eventos.repository.js");

class EventoService {

  async registrarEvento(dados) {
    return await EventoRepository.create(dados);
  }

  async findAll() {
    return await EventoRepository.findAll();
  }
  async findAllPorLoja(id) {
    return await EventoRepository.findAllPorLoja(id);
  }

}

module.exports = new EventoService();