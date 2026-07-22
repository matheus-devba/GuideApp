const ProdutoImagensService = require('../services/produto-imagens.service.js')

class ProdutoImagensController {
    async buscarImagens(req, res) {
        try {
            const { id } = req.params
            const imagens = await ProdutoImagensService.buscarImagens(id)
            return res.status(200).json(imagens)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
  
    }
    async buscarPrimeiraImagem(req, res) {
        try {
            const { id } = req.params
            const imagem = await ProdutoImagensService.buscarPrimeiraImagem(id)
            return res.redirect(imagem.url)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
  
    }
}

module.exports = new ProdutoImagensController();