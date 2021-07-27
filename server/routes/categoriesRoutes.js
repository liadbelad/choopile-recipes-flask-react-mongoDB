const express = require("express")
const {
  getAllCategories,
  getAllCategoriesOfUserRecipes,
} = require("../controllers/categoriesController")
const router = express.Router()

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.get("/", getAllCategories)

// @desc    Fetch all categories of user recipes
// @route   GET /api/categories/:userId
// @access  Public
router.get("/users/:userId", getAllCategoriesOfUserRecipes)

module.exports = router
