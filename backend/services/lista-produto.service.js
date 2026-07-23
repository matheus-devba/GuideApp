const ListaProdutoRepository = require('../repositories/lista-produto.repository.js')

class ListaProdutoService {
    async buscarProdutosEmLista (lista_id) {
        //depois, fazer verificação se a lista existe 
        return await ListaProdutoRepository.buscarProdutosEmLista(lista_id)
    }
    async atualizar (lista_id, produtos) {
        //depois, fazer verificação se a lista existe 
        return await ListaProdutoRepository.atualizar(lista_id, produtos)
    }

}

module.exports = new ListaProdutoService()