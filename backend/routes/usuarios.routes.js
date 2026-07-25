const UsuariosController = require("../controllers/usuarios.controller.js")
const express = require("express")
const router = express.Router()

router.get("/", UsuariosController.buscarUsuarios)
router.get("/:id", UsuariosController.buscarUsuario) 
router.get("/adm/", UsuariosController.buscarAdm) 


router.post("/root/new", UsuariosController.criarAdm) 
router.post("/new", UsuariosController.criarUsuario) 

router.put("/update/:id", UsuariosController.editarUsuario) 
router.delete("delete/:id", UsuariosController.excluirUsuario) 



module.exports = router