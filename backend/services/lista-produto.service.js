const ListaProdutoRepository = require('../repositories/lista-produto.repository.js')

class ListaProdutoService {
    async buscarProdutosEmLista (lista_id) {
        //depois, fazer verificação se a lista existe 
        return await ListaProdutoRepository.buscarProdutosEmLista(lista_id)
    }

}

module.exports = new ListaProdutoService()