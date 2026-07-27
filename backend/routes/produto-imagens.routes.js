const ProdutoImagensController = require("../controllers/produto-imagens.controller.js")
const express = require("express")
const router = express.Router()
const upload = require("../config/multer.js")

// router.post("/new", upload.fields([
//   { name: "icon", maxCount: 1 }
// ]), CategoriasController.criar)

// router.put("/update/:id", upload.fields([
//   { name: "icon", maxCount: 1 }
// ]), CategoriasController.atualizar)

router.post("/new/:id", upload.array("imagens", 5), ProdutoImagensController.criarImagens)
router.get("/buscar_imagens/:id", ProdutoImagensController.buscarImagens)
router.get("/buscar_imagem/:id", ProdutoImagensController.buscarPrimeiraImagem)
router.delete("/delete/:id", ProdutoImagensController.deletarPorUrl);


module.exports = router