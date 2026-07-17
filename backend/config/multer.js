const path = require("path")
const fs = require("fs")
const multer = require("multer")

const logoDir = path.join(__dirname, "..", "uploads", "logo")
const bannerDir = path.join(__dirname, "..", "uploads", "banners")

fs.mkdirSync(logoDir, { recursive: true })
fs.mkdirSync(bannerDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") {
      return cb(null, logoDir)
    }

    if (file.fieldname === "banner") {
      return cb(null, bannerDir)
    }

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