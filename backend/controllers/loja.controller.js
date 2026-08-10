const LojaService = require("../services/loja.service.js")
const { uploadParaSupabase } = require("../middleware/helperSupabase.js")


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

    async buscarPorNicho(req, res) {
        try {
            const { id } = req.params //desestruturação para quando tiver outros parametros, so colocar uma ","
            const loja = await LojaService.buscarPorNicho(id)
            return res.status(200).json(loja)
        } catch (error) {
            return res.status(404).json({
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

        const logoUrl = logoFile ? await uploadParaSupabase(logoFile, "lojas", "logos") : null
        const bannerUrl = bannerFile ? await uploadParaSupabase(bannerFile, "lojas", "banners") : null

        const loja = await LojaService.criar({
            ...body,
            logo_url: logoUrl,
            banner_url: bannerUrl,
        })

        return res.status(201).json(loja)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

    async atualizar(req, res) {
        try {
            const { id } = req.params
            const { body, files } = req
            const current = await LojaService.buscarPorId(id) // para pegar a imagem atual (caso ela não for alterada para nao dá null)

            const logoFile = files?.logo?.[0]
            const bannerFile = files?.banner?.[0]
            
            const logoUrl = logoFile ? await uploadParaSupabase(logoFile, "lojas", "logos") : null
            const bannerUrl = bannerFile ? await uploadParaSupabase(bannerFile, "lojas", "banners") : null

            const loja = await LojaService.atualizar(id, {
            ...body,
            logo_url: logoFile ? logoUrl : current.logo_url,
            banner_url: bannerFile ? bannerUrl : current.banner_url,
            })

            return res.status(200).json(loja)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    
    async atualizarPerfil(req, res) {
        try {
            const { id } = req.params
            const { body, files } = req
            const current = await LojaService.buscarPorId(id) // para pegar a imagem atual (caso ela não for alterada para nao dá null)

            const logoFile = files?.logo?.[0]
            const bannerFile = files?.banner?.[0]

            const logoUrl = logoFile ? await uploadParaSupabase(logoFile, "lojas", "logos") : null
            const bannerUrl = bannerFile ? await uploadParaSupabase(bannerFile, "lojas", "banners") : null

            const loja = await LojaService.atualizarPerfil(id, {
            ...body,
            logo_url: logoFile ? logoUrl : current.logo_url,
            banner_url: bannerFile ? bannerUrl : current.banner_url,
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