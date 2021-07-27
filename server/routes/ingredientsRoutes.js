const express = require("express")
const { getAllIngredientsQuery } = require("../DAL/api")
const router = express.Router()

// @desc    Fetch all ingredients
// @route   GET /api/ingredients
// @access  Public
router.get("/", async (req, res) => {
  try {
    const ingredients = await getAllIngredientsQuery()
    res.json(ingredients)
  } catch (error) {
    res.status(404).json(error.message)
  }
})

module.exports = router
