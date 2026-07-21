const ProdutosService = require('../services/produtos.service.js')

class ProdutoController {
    async buscarAtivosPorLoja(req, res) {
        try {
            const { id } = req.params 
            const produtosAtivos = await ProdutosService.buscarAtivosPorLoja(id)
            return res.status(200).json(produtosAtivos)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async buscarOcultosPorLoja(req, res) {
        try {
            const { id } = req.params 
            const produtosOcultos = await ProdutosService.buscarOcultosPorLoja(id)
            return res.status(200).json(produtosOcultos)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async criar(req, res) {
        try {
            const { body } = req
            const produto = await ProdutosService.criar(body)
            return res.status(201).json(produto)
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params
            const { body } = req
            const produto = await ProdutosService.atualizar(id, body)
            return res.status(201).json(produto)
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }

    async desativar(req, res) {
        try {
            const { id } = req.params
            const produto = await ProdutosService.desativar(id)
            return res.status(200).json(produto)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async ativar(req, res) {
        try {
            const { id } = req.params
            const produto = await ProdutosService.ativar(id)
            return res.status(200).json(produto)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params
            const produto = await ProdutosService.deletar(id)
            return res.status(200).json(produto)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}


module.exports = new ProdutoController();