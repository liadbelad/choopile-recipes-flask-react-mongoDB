const {
  getAllCategoriesQuery,
  getAllCategoriesOfUserRecipesQuery,
} = require("../DAL/api")

const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesQuery()
    res.json(categories)
  } catch (error) {
    res.status(404).json(error.message)
  }
}

const getAllCategoriesOfUserRecipes = async (req, res) => {
  const { userId } = req.params

  try {
    const categoriesOfUserRecipes = await getAllCategoriesOfUserRecipesQuery(
      userId
    )
    res.json(categoriesOfUserRecipes)
  } catch (error) {
    res.status(404).json(error.message)
  }
}

module.exports = { getAllCategories, getAllCategoriesOfUserRecipes }
