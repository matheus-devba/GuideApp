const UsuariosService = require("../services/usuarios.service.js")
const bcrypt = require("bcryptjs")

class UsuariosController {
    async buscarTodos(req, res) {
        try {
            const usuarios = await UsuariosService.buscarTodos()
            return res.status(200).json(usuarios)
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
  
    }
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
            const adm = await UsuariosService.criarAdm(body)
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
            const usuario = await UsuariosService.criarUsuario(body)
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
            const usuario =  await UsuariosService.editarUsuario(id, dados )
            return res.status(200).json(usuario)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
    async editarUsuario(req, res) {
        try {
            const { id } = req.params
            const { dados  } = req.body
            const usuario =  await UsuariosService.editarUsuario(id, dados )
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

    async login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
        }

        // Busca o usuário no banco pelo e-mail
        // Importante: vamos usar o repositório diretamente ou através do service
        const usuario = await UsuariosService.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        if (!usuario.ativo) {
            return res.status(403).json({ message: "Este usuário está desativado." });
        }

        // Compara a senha informada com o hash salvo no banco
        const senhaValida = await bcrypt.compare(password, usuario.password_hash);

        if (!senhaValida) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        // Remove a senha do objeto de retorno por segurança
        delete usuario.password_hash;

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            usuario
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
}

module.exports = new UsuariosController();