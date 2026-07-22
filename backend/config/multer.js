const path = require("path")
const fs = require("fs")
const multer = require("multer")

const logoDir = path.join(__dirname, "..", "uploads", "logo")
const bannerDir = path.join(__dirname, "..", "uploads", "banners")
const iconDir = path.join(__dirname, "..", "uploads", "icons_categorias")
const produtoImagensDir = path.join(__dirname, "..", "uploads", "produto_imagens")


fs.mkdirSync(logoDir, { recursive: true })
fs.mkdirSync(bannerDir, { recursive: true })
fs.mkdirSync(iconDir, { recursive: true })
fs.mkdirSync(produtoImagensDir, { recursive: true })


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") return cb(null, logoDir)
    if (file.fieldname === "banner") return cb(null, bannerDir)
    if (file.fieldname === "icon") return cb(null, iconDir)
    if (file.fieldname === "imagens") return cb(null, produtoImagensDir)

    cb(null, path.join(__dirname, "..", "uploads"))
  },
  
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${unique}${ext}`)
  },
})

const upload = multer({ storage })

module.exports = upload