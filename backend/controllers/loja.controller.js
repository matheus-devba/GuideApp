const LojaService = require("../services/loja.service.js")

class LojaController {
    async buscarTodas(req, res) {
        try {
            const lojas = await LojaService.buscarTodas()
            return res.status(200).json(lojas)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params //desestruturação para quando tiver outros parametros, so colocar uma ","
            const loja = await LojaService.buscarPorId(id)
            return res.status(200).json(loja)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async criar(req, res) {
        try {
            const loja = await LojaService.criar(req.body)
            return res.status(201).json(loja)
        } catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params
            const loja = await LojaService.atualizar(id,req.body)
            return res.status(200).json(loja)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async ocultar(req, res) {
        try {
            const { id } = req.params
            const loja = await LojaService.desativar(id)
            return res.status(200).json(loja)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async ativar(req, res) {
        try {
            const { id } = req.params
            const loja = await LojaService.ativar(id)
            return res.status(200).json(loja)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = new LojaController();