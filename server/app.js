const express = require("express")
const colors = require("colors")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const logger = require("morgan")

const userRouter = require("./routes/userRoutes")
const recipeRouter = require("./routes/recipeRoutes")
const categoriesRouter = require("./routes/categoriesRoutes")
const measureUnitsRouter = require("./routes/measureUnitsRoutes")
const ingredientsRouter = require("./routes/ingredientsRoutes")
const fileUpload = require("./middlewares/fileUploadMiddleware")
const { COOKIE_TIME_24_HOURS } = require("./utills/constants")
const app = express()
require("dotenv").config()
const sendMail = require("./config/sendGrid")
// sendMail()

// make connection for cookies
app.use(cors({ origin: "http://localhost:3000", credentials: true }))

app.use(logger("dev"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    key: "user",
    secret: "subscribe", // I know it needs to be super secret just for comfort purposes
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: COOKIE_TIME_24_HOURS,
    },
  })
)
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/recipes", recipeRouter)
app.use("/api/users", userRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/measure_units", measureUnitsRouter)
app.use("/api/ingredients", ingredientsRouter)

app.post("/upload_files", fileUpload.array("image"), uploadFiles)

function uploadFiles(req, res) {
  res.json({ message: "Successfully uploaded files" })
}

module.exports = app
