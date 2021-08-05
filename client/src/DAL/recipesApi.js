import axios from "axios"
import { CONFIG } from "../utills/js/constants"

const getNewestRecipes = async (pageNumber = 1) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/recipes/newest?pageNumber=${pageNumber}`
    )
    const newestRecipes = await response.json()

    return newestRecipes
  } catch (error) {
    return error.message
  }
}

const getNumberOfPages = async (userRecipes = "") => {
  try {
    const { data } = await axios(
      `http://localhost:5000/api/recipes/pages?user=${userRecipes}`
    )
    return data
  } catch (error) {
    return error.message
  }
}

const getRecipesBySearchTerm = async (
  keyword = "",
  pageNumber = "",
  category = ""
) => {
  try {
    const { data: recipes } = await axios(
      `http://localhost:5000/api/recipes?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}`
    )
    return recipes
  } catch (error) {
    return error.message
  }
}

const addNewRecipe = async (newRecipe) => {
  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/recipes/add`,
      newRecipe,
      CONFIG
    )
    return data
  } catch (error) {
    return error.response.data
  }
}

const updateRecipe = async (updatedRecipe, recipeId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/recipes/${recipeId}`,
      {
        method: "PUT",
        body: updatedRecipe,
      }
    )
    return await response.json()
  } catch (error) {
    return error.message
  }
}

const updateRecipeViewsById = async (recipeID) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/recipes/views/${recipeID}`
    )
    return data
  } catch (error) {
    return error.message
  }
}

const addRecipeCommentById = async ({ recipeID, content }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/recipes/comments/${recipeID}`,
      content,
      CONFIG
    )
    return data
  } catch (error) {
    return error.message
  }
}

export {
  getNewestRecipes,
  getRecipesBySearchTerm,
  updateRecipeViewsById,
  addRecipeCommentById,
  addNewRecipe,
  updateRecipe,
  getNumberOfPages,
}
