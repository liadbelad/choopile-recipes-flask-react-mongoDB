const express = require("express")
const router = express.Router()
const {
  getRecipes,
  getRecipesOfCategory,
  getUserRecipes,
  getPopularRecipes,
  getNewestRecipes,
  getSingleRecipeById,
  updateSingleRecipeViewsById,
  addSingleRecipe,
  updateSingleRecipe,
  addNewRecipeComment,
  getNumberOfPages,
} = require("../controllers/recipeController")
const fileUpload = require("../middlewares/fileUploadMiddleware")
const validation = require("../middlewares/validationMiddleware")
const validateCookie = require("../middlewares/validateCookieMiddleware")
const { recipeDetailsSchema } = require("../validations/recipeValidation")
const { commentSchema } = require("../validations/commentValidation")

// `/api/recipes?popular='false'&keyword=${keyword}&pageNumber=${pageNumber}&recipeCount={recipeCount}`

// get 1 time the data from server on homepage and then manpulate date on client routes using context for recipes

router.get("/", getRecipes)

router.get("/pages", getNumberOfPages)

router.get("/categories", getRecipesOfCategory)

router.get("/users", validateCookie, getUserRecipes)

router.get("/popular", getPopularRecipes)

router.get("/newest", getNewestRecipes)

router.post(
  "/add",
  fileUpload.single("imageFiles"),

  validateCookie,
  validation(recipeDetailsSchema),
  addSingleRecipe
)

router.post(
  "/comments/:recipeId",
  validateCookie,
  validation(commentSchema),
  addNewRecipeComment
)

router.put("/views/:recipeId", validateCookie, updateSingleRecipeViewsById)

router
  .route("/:recipeId")
  .get(getSingleRecipeById)
  .put(
    fileUpload.single("imageFiles"),
    validation(recipeDetailsSchema),
    updateSingleRecipe
  )

module.exports = router
