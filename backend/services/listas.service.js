const ListasRepository = require('../repositories/listas.repository.js')

class ListasService {
    async buscarListas () {
        return await ListasRepository.buscarListas()
    }
    async buscarListaPorId (id) {
        const lista = await ListasRepository.buscarListaPorId(id)
        if(!lista) {
            throw new Error("Lista não encontrada")
        }

        return lista
    }
    async atualizar (id, nome ) {
        const lista = await ListasRepository.atualizar(id, nome )
        return lista
    }

}

module.exports = new ListasService()