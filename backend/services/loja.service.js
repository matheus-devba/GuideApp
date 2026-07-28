const LojaRepository = require("../repositories/loja.repository.js")

class LojaService{
    async buscarTodas() {
    return await LojaRepository.buscarTodas();
    }
    async buscarAtivas() {
    return await LojaRepository.buscarAtivas();
    }

    async buscarPorId(id) {
        const loja = await LojaRepository.buscarPorId(id)

        if (!loja) {
            throw new Error("Loja não encontrada")
        }

        return loja
    }

    async criar (dados) {
        return await LojaRepository.criarLoja(dados)
    }

    async atualizar (id, dados) {
        return await LojaRepository.atualizar(id, dados)
    }
    async atualizarPerfil (id, dados) {
        return await LojaRepository.atualizarPerfil(id, dados)
    }

    async desativar (id) {
        const loja = await LojaRepository.buscarPorId(id)

        if (!loja) {
            throw new Error("Loja não encontrada")
        }
        return await LojaRepository.desativar(id)
    }

    async ativar (id) {
        const loja = await LojaRepository.buscarPorId(id)

        if (!loja) {
            throw new Error("Loja não encontrada")
        }
        return await LojaRepository.ativar(id)
    }
}

module.exports = new LojaService();