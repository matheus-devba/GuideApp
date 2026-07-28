const LojaController = require("../controllers/loja.controller.js")
const express = require("express")
const router = express.Router()
const upload = require("../config/multer.js")


router.post("/new", upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]), LojaController.criar)

router.put("/update/:id", upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]), LojaController.atualizar)

router.put("/update/perfil/:id", upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]), LojaController.atualizarPerfil)

router.get("/", LojaController.buscarAtivas)
router.get("/all", LojaController.buscarTodas)
router.get("/:id", LojaController.buscarPorId)
router.patch("/hidden/:id", LojaController.ocultar)
router.patch("/active/:id", LojaController.ativar)





module.exports = router