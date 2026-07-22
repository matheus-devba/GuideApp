const ListasService = require('../services/listas.service.js')

class ListasController {
    async buscarListas(req, res) {
        try {
            const listas =  await ListasService.buscarListas()
            return res.status(200).json(listas)
        } catch (error) {
             return res.status(500).json({
                message: error.message
            })
        }
    }
}


module.exports = new ListasController();