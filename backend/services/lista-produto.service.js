const ListaProdutoRepository = require('../repositories/lista-produto.repository.js')

class ListaProdutoService {
    async buscarProdutosEmLista (lista_id) {
        //depois, fazer verificação se a lista existe 
        return await ListaProdutoRepository.buscarProdutosEmLista(lista_id)
    }
    async atualizar(lista_id, payload) {
    const produtos = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.produtos)
        ? payload.produtos
        : [];

    return await ListaProdutoRepository.atualizar(lista_id, produtos);
    }
    async buscarIdPorListaId (lista_id) {
        return await ListaProdutoRepository.buscarIdPorListaId(lista_id)
    }

}

module.exports = new ListaProdutoService()
