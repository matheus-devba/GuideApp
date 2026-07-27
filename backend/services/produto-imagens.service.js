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

    async deletarPorUrl(produto_id, url) {
    return await ProdutoImagensRepository.deletarPorUrl(produto_id, url);
  }
}

module.exports = new ProdutoImagensService();