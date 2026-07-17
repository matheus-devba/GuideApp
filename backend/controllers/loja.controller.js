const LojaService = require("../services/loja.service.js")

class LojaController {
    async buscarAtivas(req, res) {
        try {
            const lojas = await LojaService.buscarAtivas()
            return res.status(200).json(lojas)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

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
            const { body, files } = req

            const logoFile = files?.logo?.[0]
            const bannerFile = files?.banner?.[0]

            const loja = await LojaService.criar({
            ...body,
            logo_url: logoFile ? `/uploads/logo/${logoFile.filename}` : null,
            banner_url: bannerFile ? `/uploads/banners/${bannerFile.filename}` : null,
            })
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
            const { body, files } = req
            const current = await LojaService.buscarPorId(id) // para pegar a imagem atual (caso ela não for alterada para nao dá null)

            const logoFile = files?.logo?.[0]
            const bannerFile = files?.banner?.[0]

            const loja = await LojaService.atualizar(id, {
            ...body,
            logo_url: logoFile ? `/uploads/logo/${logoFile.filename}` : current.logo_url,
            banner_url: bannerFile ? `/uploads/banners/${bannerFile.filename}` : current.banner_url,
            })

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