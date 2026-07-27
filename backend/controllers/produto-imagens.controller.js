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

async criarImagens(req, res) {
    try {
      const { id } = req.params
      const { files } = req

      if (!files || files.length === 0) {
        return res.status(400).json({
          message: "Envie ao menos uma imagem"
        })
      }

      const imagens = files.map((file, index) => ({
        url: `/uploads/produto_imagens/${file.filename}`,
        ordem: index + 1
      }))

      const result = await ProdutoImagensService.criarImagens(id, imagens)
      return res.status(201).json(result)
    } catch (error) {
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

      async deletarPorUrl(req, res) {
    try {
      const { id } = req.params;
      const { url } = req.body;
      const result = await ProdutoImagensService.deletarPorUrl(id, url);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProdutoImagensController();