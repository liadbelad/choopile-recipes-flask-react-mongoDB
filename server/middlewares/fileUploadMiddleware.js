const multer = require("multer")
const { v4: uuidv4 } = require("uuid")

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
}

const fileUpload = multer({
  limits: 1000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/")
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPE_MAP[file.mimetype]
      cb(null, uuidv4() + "." + extension)
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error("תמונות בלבד !")
    cb(error, isValid)
  },
})

module.exports = fileUpload

// how to use the middleware
// fileUpload.single('image') => image = name in the request
