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
    async buscarPorNicho(id) {
        const categorias = await CategoriasRepository.buscarPorNicho(id)

        if (!categorias) {
            throw new Error ("Categoria não encontrada")
        }

        return categorias
    }
    async buscarPorLoja(loja_id) {
        const categorias = await CategoriasRepository.buscarPorLoja(loja_id)

        if (!categorias) {
            throw new Error ("Categoria não encontrada")
        }

        return categorias
    }

    async criar(dados) {
        return await CategoriasRepository.criarCategoria(dados)
    }

    async atualizar(id, dados) {
        return await CategoriasRepository.editarCategoria(id, dados)
    }

    async deletar(id) {
        return await CategoriasRepository.excluirCategoria(id)
    }
}

module.exports = new CategoriasService();