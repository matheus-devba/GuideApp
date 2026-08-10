const ListasRepository = require('../repositories/listas.repository.js')

class ListasService {
    async buscarListasPorNicho (id) {
        return await ListasRepository.buscarListasPorNicho(id)
    }
    async buscarListaPorId (id) {
        const lista = await ListasRepository.buscarListaPorId(id)
        if(!lista) {
            throw new Error("Lista não encontrada")
        }

        return lista
    }
    async buscarLista (id) {
        const lista = await ListasRepository.buscarLista(id)
        if(!lista) {
            throw new Error("Lista não encontrada")
        }

        return lista
    }
    async buscarListaPorLojaId (loja_id) {
        return await ListasRepository.buscarListaPorLojaId(loja_id)
    }
    async atualizar (id, nome ) {
        const lista = await ListasRepository.atualizar(id, nome )
        return lista
    }
    async criar (dados ) {
        const lista = await ListasRepository.criar(dados)
        return lista
    }
    async deletar (id ) {
        const lista = await ListasRepository.deletar(id)
        return lista
    }
    async ocultar (id ) {
        const lista = await ListasRepository.ocultar(id)
        return lista
    }

}

module.exports = new ListasService()