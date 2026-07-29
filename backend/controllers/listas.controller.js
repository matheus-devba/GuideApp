const ListasService = require('../services/listas.service.js')

class ListasController {
    async buscarListas(req, res) {
        try {
            const listas =  await ListasService.buscarListas()
            return res.status(200).json(listas)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async buscarListaPorId(req, res) {
        try {
            const { id } = req.params
            const lista =  await ListasService.buscarListaPorId(id)
            return res.status(200).json(lista)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    
    async buscarLista(req, res) {
        try {
            const { id } = req.params
            const lista =  await ListasService.buscarLista(id)
            return res.status(200).json(lista)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async buscarListaPorLojaId(req, res) {
        try {
            const { id } = req.params
            const listas =  await ListasService.buscarListaPorLojaId(id)
            return res.status(200).json(listas)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params
            const { nome  } = req.body
            const lista =  await ListasService.atualizar(id, nome )
            return res.status(200).json(lista)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async criar(req, res) {
        try {
            const { nome, loja_id } = req.body
            const lista = await ListasService.criar({ nome, loja_id });
            return res.status(201).json(lista)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.body
            const lista = await ListasService.deletar(id);
            return res.status(200).json(lista)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async ocultar(req, res) {
        try {
            const { id } = req.body
            const lista = await ListasService.ocultar(id);
            return res.status(200).json(lista)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
}


module.exports = new ListasController();