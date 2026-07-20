const CategoriasController = require("../controllers/categorias.controller.js")
const express = require("express")
const router = express.Router()
const upload = require("../config/multer.js")

router.post("/new", upload.fields([
  { name: "icon", maxCount: 1 }
]), CategoriasController.criar)

router.put("/update/:id", upload.fields([
  { name: "icon", maxCount: 1 }
]), CategoriasController.atualizar)

router.get("/", CategoriasController.buscarCategorias)
router.get("/:id", CategoriasController.buscarPorId)
router.patch("/delete/:id", CategoriasController.deletar)


module.exports = router