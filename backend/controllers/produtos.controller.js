const ProdutosService = require('../services/produtos.service.js')

class ProdutoController {
    async buscarAtivos(req, res) {
        try {
            const produtosAtivos = await ProdutosService.buscarAtivos()
            return res.status(200).json(produtosAtivos)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async buscarPorTermoPorLoja(req, res) {
    try {
        const { id } = req.params
        const { q = "", destaque } = req.query
        const somenteDestaques = destaque === "true" || destaque === "1"

        const produtos = await ProdutosService.buscarPorTermoPorLoja(id, q, somenteDestaques)    
        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

    async buscarDestaques(req, res) {
        try {
            const produtosDestaques = await ProdutosService.buscarDestaques()
            return res.status(200).json(produtosDestaques)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
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
    async buscarPorCategoria(req, res) {
        try {
            const { id } = req.params 
            const { loja_id } = req.query
            const produtos = await ProdutosService.buscarPorCategoria(
            Number(loja_id),
            Number(id)
            )
            return res.status(200).json(produtos)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async buscarDestaquesPorLoja(req, res) {
        try {
            const { id } = req.params 
            const destaques = await ProdutosService.buscarDestaquesPorLoja(id)
            return res.status(200).json(destaques)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    
    async buscarProduto(req, res) {
        try {
            const { id } = req.params 
            const produto = await ProdutosService.buscarProduto(id)
            return res.status(200).json(produto)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async buscarProdutoAtivo(req, res) {
        try {
            const { id } = req.params 
            const produto = await ProdutosService.buscarProdutoAtivo(id)
            return res.status(200).json(produto)
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
    async addView(req, res) {
        try {
            const { id } = req.params
            const produto = await ProdutosService.addView(id)
            return res.status(200).json(produto)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async addInteresse(req, res) {
        try {
            const { id } = req.params
            const produto = await ProdutosService.addInteresse(id)
            return res.status(200).json(produto)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async destacar(req, res) {
        try {
            const { id } = req.params
            const { status } = req.body
            const produto = await ProdutosService.destacar(id, status)
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