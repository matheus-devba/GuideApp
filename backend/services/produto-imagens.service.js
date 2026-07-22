const ProdutoImagensRepository = require('../repositories/produto-imagens.repository.js')

class ProdutoImagensService {
    async buscarImagens(produto_id) {
        return await ProdutoImagensRepository.buscarImagens(produto_id)
    }
    async buscarPrimeiraImagem(produto_id) {
        return await ProdutoImagensRepository.buscarPrimeiraImagem(produto_id)
    }
}

module.exports = new ProdutoImagensService();