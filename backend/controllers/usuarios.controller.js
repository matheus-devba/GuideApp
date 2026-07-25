const UsuariosService = require("../services/usuarios.service.js")

class UsuariosController {
    async buscarUsuarios(req, res) {
        try {
            const usuarios = await UsuariosService.buscarUsuarios()
            return res.status(200).json(usuarios)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
  
    }
    async buscarAdm(req, res) {
        try {
            const adm = await UsuariosService.buscarAdm()
            return res.status(200).json(adm)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
  
    }

    async buscarUsuario(req, res) {
        try {
            const { id } = req.params
            const usuario = await UsuariosService.buscarUsuario(id)
            return res.status(200).json(usuario)
        }
        catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
  
    }

    async criarAdm(req, res) {
        try {
            const { body } = req
            const adm = await ProdutosService.criarAdm(body)
            return res.status(201).json(adm)
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }

    }
    async criarUsuario(req, res) {
        try {
            const { body } = req
            const usuario = await ProdutosService.criarUsuario(body)
            return res.status(201).json(usuario)
        }
        catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }

    }

    async editarUsuario(req, res) {
        try {
            const { id } = req.params
            const { dados  } = req.body
            const usuario =  await ListasService.editarUsuario(id, dados )
            return res.status(200).json(usuario)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }

    async excluirUsuario(req, res) {
        try {
            const { id } = req.params
            const usuario = await UsuariosService.excluirUsuario(id)
            return res.status(200).json(usuario)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
            
        }
    }
}

module.exports = new UsuariosController();