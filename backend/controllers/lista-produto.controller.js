const ListaProdutoService = require('../services/lista-produto.service.js')

class ListaProdutoController {
    async buscarProdutosEmLista(req, res) {
        try {
            const { id } = req.params
            const produtos =  await ListaProdutoService.buscarProdutosEmLista(id)
            return res.status(200).json(produtos)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }

    async atualizar(req, res) {
        try {
            const { body } = req
            const { id } = req.params
            const produtos =  await ListaProdutoService.atualizar(id, body)
            return res.status(200).json(produtos)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }

    async buscarIdPorListaId(req, res) {
        try {
            const { id } = req.params
            const idListaProduto =  await ListaProdutoService.buscarIdPorListaId(id)
            return res.status(200).json(idListaProduto)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
}


module.exports = new ListaProdutoController();