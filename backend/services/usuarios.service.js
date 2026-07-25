const UsuariosRepository = require("../repositories/usuarios.repository.js")

class UsuariosService {
    async buscarUsuarios() {
        return await UsuariosRepository.buscarUsuarios()
    }
    async buscarAdm() {
        return await UsuariosRepository.buscarAdm()
    }

    async buscarUsuario(id) {
        const usuario = await UsuariosRepository.buscarUsuario(id)

        if (!usuario) {
            throw new Error ("usuario não encontrado")
        }

        return usuario
    }

    async criarAdm(dados) {
        return await UsuariosRepository.criarAdm(dados)
    }

    async criarUsuario(dados) {
        return await UsuariosRepository.criarUsuario(dados)
    }

    async editarUsuario(id, dados) {
        return await UsuariosRepository.editarUsuario(id, dados)
    }

    async excluirUsuario(id) {
        return await UsuariosRepository.excluirUsuario(id)
    }
}

module.exports = new UsuariosService();