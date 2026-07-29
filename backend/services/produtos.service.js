const ProdutosRepository = require('../repositories/produtos.repository.js')

class ProdutosService {
    async buscarAtivos () {
        return await ProdutosRepository.buscarAtivos()
    }
    
    async buscarDestaques () {
        return await ProdutosRepository.buscarDestaques()
    }
    
    async buscarProduto (id) {
        return await ProdutosRepository.buscarProduto(id)
    }
    
    async buscarAtivosPorLoja (id_loja) {
        return await ProdutosRepository.buscarAtivosPorLoja(id_loja)
    }
    async buscarPorCategoria (categoria_id, loja_id) {
        return await ProdutosRepository.buscarPorCategoria(categoria_id, loja_id)
    }
    async buscarDestaquesPorLoja (id_loja) {
        return await ProdutosRepository.buscarDestaquesPorLoja(id_loja)
    }
    
    async buscarOcultosPorLoja (id_loja) {
        return await ProdutosRepository.buscarOcultosPorLoja(id_loja)
    }

    async criar (dados) {
        return await ProdutosRepository.criar(dados)
    }

    async atualizar (id,dados) {
        return await ProdutosRepository.atualizar(id, dados)
    }

    async desativar (id) {
        return await ProdutosRepository.desativar(id)
    }

    async ativar (id) {
        return await ProdutosRepository.ativar(id)
    }
    async destacar (id, status) {
        return await ProdutosRepository.destacar(id, status)
    }

    async deletar (id) {
        return await ProdutosRepository.deletar(id)
    }
}


module.exports = new ProdutosService();