import axios from "axios"
import { CONFIG } from "../utills/js/constants"

const DUMMY_USERS = [
  {
    id: 1,
    firstName: "Liad",
    lastName: "Beladev",
    email: "liad@gmail.com",
    password: "Secret123",
  },
  {
    id: 2,
    firstName: "Gal",
    lastName: "Beladev",
    email: "gal@gmail.com",
    password: "secret12",
  },
  {
    id: 3,
    firstName: "Moshmosh",
    lastName: "Beladev",
    email: "moshmosh@gmail.com",
    password: "Secret123",
  },
]

const getSessionFromServer = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/users/login")
    return data
  } catch (error) {
    return error.message
  }
}

const login = async (loginUser) => {
  try {
    const { data: userInfo } = await axios.post(
      "http://localhost:5000/api/users/login",
      loginUser,
      CONFIG
    )

    return {
      loading: false,
      success: true,
      userInfo,
      message: "מתחבר...",
    }
  } catch (error) {
    return { loading: false, error: true, message: error.response.data.message }
  }
}

const register = async (newUser) => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "שגיאה בהרשמה,נסה שוב")
    }

    return {
      loading: false,
      success: true,
      userInfo: data,
      message: "נרשמת בהצלחה!!",
    }
  } catch (error) {
    console.log("register client error:", error)

    return { loading: false, error: true, message: error.message }
  }
}

const getUserDetails = async (userID = 4) => {
  try {
    const user = DUMMY_USERS.find((user) => user.id === userID)
    if (!user) throw new Error("who are you?")
    return user
  } catch (error) {
    return error.message
  }
}

const getUserRecipes = async ({
  activePageNumber: pageNumber,
  categoryID = "",
}) => {
  try {
    const { data: userRecipes } = await axios(
      `http://localhost:5000/api/recipes/users?pageNumber=${pageNumber}&category=${categoryID} `,
      CONFIG
    )
    return userRecipes
  } catch (error) {
    return error.message
  }
}

const getAllCategoriesOfUserRecipes = async (userID) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/categories/users/${userID}`
    )
    return data
  } catch (error) {
    return error.message
  }
}

// RECIPES ACTIONS

const getAllCategories = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/categories`)
    const categories = await response.json()

    // const transformedCategories = categories.map((category) => ({
    //   value: category.id,
    //   label: category.label,
    // }))
    // return transformedCategories
    return categories
  } catch (error) {
    return error.message
  }
}

const getAllMeasureUnits = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/measure_units")
    const measureUnits = await response.json()
    return measureUnits
  } catch (error) {
    return error.message
  }
}

const getAllIngredients = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/ingredients")
    const ingredients = await response.json()
    return ingredients
  } catch (error) {
    return error.message
  }
}

const getAllRecipes = async ({
  activePageNumber: pageNumber,
  categoryID = "",
}) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/recipes?pageNumber=${pageNumber}&category=${categoryID}`
    )
    const recipes = await response.json()

    return recipes
  } catch (error) {
    return error.message
  }
}

const getFullRecipeDetailsByID = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/recipes/${id}`)
    const recipe = await response.json()

    if (!recipe) throw new Error("recipe not found")
    return recipe
  } catch (error) {
    return error.message
  }
}

const getRecipesByCategory = async (categoryID) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/recipes/categories/?category=${categoryID}`
    )

    return data
  } catch (error) {
    return error.message
  }
}

const getUserRecipesByCategory = async ({ userID, categoryID }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/recipes/categories/?category=${categoryID}&user=${userID}`
    )
    return data
  } catch (error) {
    return error.message
  }
}

export {
  login,
  register,
  getAllCategories,
  getAllRecipes,
  getFullRecipeDetailsByID,
  getAllCategoriesOfUserRecipes,
  getUserRecipesByCategory,
  getUserRecipes,
  getRecipesByCategory,
  getAllMeasureUnits,
  getAllIngredients,
  getSessionFromServer,
}
