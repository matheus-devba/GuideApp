const CategoriaService = require("../services/categorias.service.js")

class CategoriasController {
    async buscarCategorias(req, res) {
        try {
            const categorias = await CategoriaService.buscarTodas()
            return res.status(200).json(categorias)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
  
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params
            const categoria = await CategoriaService.buscarPorId(id)
            return res.status(200).json(categoria)
        }
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
  
    }

    async criar(req, res) {
        try {
            const { body, files } = req

            const iconFile = files?.icon?.[0]

            const categoria = await CategoriaService.criar({
            ...body,
            icon_url: iconFile ? `/uploads/icons_categorias/${iconFile.filename}` : null,
            })
            return res.status(201).json(categoria)
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
            const current = await CategoriaService.buscarPorId(id) // para pegar a imagem atual (caso ela não for alterada para nao dá null)

            const iconFile = files?.icon?.[0]

            const categoria = await CategoriaService.atualizar(id, {
            ...body,
            icon_url: iconFile ? `/uploads/icons_categorias/${iconFile.filename}` : current.icone_url,
            })

            return res.status(200).json(categoria)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params
            const categoria = await CategoriaService.deletar(id)
            return res.status(200).json(categoria)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
            
        }
    }
}

module.exports = new CategoriasController();