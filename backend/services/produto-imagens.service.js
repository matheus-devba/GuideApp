const ProdutoImagensRepository = require('../repositories/produto-imagens.repository.js')

class ProdutoImagensService {
    async buscarImagens(produto_id) {
        return await ProdutoImagensRepository.buscarImagens(produto_id)
    }

    async buscarPrimeiraImagem(produto_id) {
        return await ProdutoImagensRepository.buscarPrimeiraImagem(produto_id)
    }

    async criarImagens(produto_id, imagens) {
        return await ProdutoImagensRepository.criarImagens(produto_id, imagens)
  }
}

module.exports = new ProdutoImagensService();