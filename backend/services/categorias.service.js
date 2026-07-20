const CategoriasRepository = require("../repositories/categorias.repository.js")

class CategoriasService {
    async buscarTodas() {
        return await CategoriasRepository.buscarTodas()
    }

    async buscarPorId(id) {
        const categoria = await CategoriasRepository.buscarPorId(id)

        if (!categoria) {
            throw new Error ("Categoria não encontrada")
        }

        return categoria
    }

    async criar(dados) {
        return await CategoriasRepository.criarCategoria()
    }

    async atualizar(id, dados) {
        return await CategoriasRepository.editarCategoria(id, dados)
    }

    async deletar(id) {
        return await CategoriasRepository.excluirCategoria(id)
    }
}

module.exports = new CategoriasService();