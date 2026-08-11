const ProdutoController = require('../controllers/produtos.controller.js')
const express = require("express")
const router = express.Router()


router.post("/merchant/new", ProdutoController.criar)
router.put("/update/:id", ProdutoController.atualizar)
router.get("/ativosAll", ProdutoController.buscarAtivos)
router.get("/destaques", ProdutoController.buscarDestaques)
router.get("/search/loja/:id", ProdutoController.buscarPorTermoPorLoja)
router.get("/:id", ProdutoController.buscarProduto)

router.get("/destaques/:id", ProdutoController.buscarDestaquesPorLoja)
router.get("/ativos/:id", ProdutoController.buscarAtivosPorLoja)
router.get("/ocultos/:id", ProdutoController.buscarOcultosPorLoja)

router.get("/categorias/:id", ProdutoController.buscarPorCategoria) // ja busca por loja
router.get("/categorias/guide/:id", ProdutoController.buscarPorCategoriaConsumer) // ja busca por loja
router.get("/nichos/:id", ProdutoController.buscarProdutosPorNicho) 
router.get("/promocoes/nichos/:id", ProdutoController.buscarPromocoesPorNicho) 


router.patch("/newView/:id", ProdutoController.addView)
router.patch("/addInteresse/:id", ProdutoController.addInteresse)
router.patch("/hidden/:id", ProdutoController.desativar)
router.patch("/active/:id", ProdutoController.ativar)
router.patch("/destacar/:id", ProdutoController.destacar)
router.delete("/delete/:id", ProdutoController.deletar)

module.exports = router