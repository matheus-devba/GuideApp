const ListasRepository = require('../repositories/listas.repository.js')

class ListasService {
    async buscarListas () {
        return await ListasRepository.buscarListas()
    }

}

module.exports = new ListasService()