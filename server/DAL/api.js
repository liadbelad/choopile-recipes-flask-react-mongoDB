const connection = require("../config/db")
const { arrangeRecipeData } = require("../utills/functions")

// USERS API

const userExistQuery = async (email) => {
  const query = `SELECT id FROM users WHERE email = ?`
  const connector = await connection
  const [userExist] = await connector.execute(query, [email])
  return userExist
}

const registerUserQuery = async (
  firstName,
  lastName,
  hashedPassword,
  email
) => {
  const insertNewUserQuery = `INSERT INTO users (firstName,lastName,password,email) VALUES(?,?,?,?)`

  const connector = await connection
  await connector.execute(insertNewUserQuery, [
    firstName,
    lastName,
    hashedPassword,
    email,
  ])

  const [userData] = await connector.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )

  return userData
}

const loginUserQuery = async (email) => {
  const loginQuery = `SELECT * FROM users WHERE email = ?`
  const connector = await connection
  const [userExist] = await connector.execute(loginQuery, [email])
  return userExist
}

// RECIPES API

const getRecipeBySearchTermQuery = async (keyword, limit = 10) => {
  try {
    const query = `SELECT id,userId,title 
    FROM recipes 
    WHERE title LIKE '%${keyword}%'
    OR description LIKE '%${keyword}%'
    LIMIT ${limit}
    `
    const connector = await connection
    const [recipes] = await connector.execute(query)
    return recipes
  } catch (error) {
    return error.message
  }
}

const getRecipesQuery = async (limit = 2, pageNumber = 0) => {
  const offset = (pageNumber - 1) * limit
  try {
    const connector = await connection
    const [recipes] = await connector.execute(
      `SELECT *  FROM recipes LIMIT ${limit} OFFSET ${offset}`
    )
    return recipes
  } catch (error) {
    return error.message
  }
}

const getRecipesOfCategoryQuery = async (
  categoryId,
  limit = 2,
  pageNumber = 1
) => {
  const offset = (pageNumber - 1) * limit
  try {
    const query = `SELECT recipes.id,recipes.title,recipes.userId,mainImageUrl
    FROM recipes
    WHERE recipes.id IN
    (
        SELECT recipe_categories.recipeId 
        FROM recipe_categories
        where recipe_categories.categoryId = ?
    )
    LIMIT ${limit}
    OFFSET ${offset}
    `
    const connector = await connection
    const [recipesOfCategory] = await connector.execute(query, [categoryId])
    return recipesOfCategory
  } catch (error) {
    return error.message
  }
}

const getUserRecipesOfCategoryQuery = async ({
  userId,
  category,
  pageSize: limit,
  pageNumber,
}) => {
  const offset = (pageNumber - 1) * limit

  try {
    const query = `SELECT recipes.id,recipes.title,recipes.userId,mainImageUrl
    FROM recipes
    WHERE recipes.userId = ? 
    AND recipes.id IN
    (
        SELECT recipe_categories.recipeId 
        FROM recipe_categories
        where recipe_categories.categoryId = ?
    )
    LIMIT ${limit}
    OFFSET ${offset}
    `
    const connector = await connection
    const [userRecipesOfCategory] = await connector.execute(query, [
      userId,
      category,
    ])
    return userRecipesOfCategory
  } catch (error) {
    return error.message
  }
}

const getRecipesOfUserQuery = async (userId, limit = 2, pageNumber = 1) => {
  const offset = (pageNumber - 1) * limit

  try {
    const query = `SELECT recipes.id, recipes.title,recipes.userId,recipes.mainImageUrl
    FROM recipes
    WHERE recipes.userId = ?
    LIMIT ${limit}
    OFFSET ${offset}
    
    ;`
    const connector = await connection
    const [userRecipes] = await connector.execute(query, [userId])
    return userRecipes
  } catch (error) {
    return error.message
  }
}

const getPopularRecipesQuery = async () => {
  try {
    const query = `SELECT recipes.title,recipes.views
    FROM recipes
    ORDER BY recipes.views DESC;`
    const connector = await connection
    const [rows] = await connector.execute(query)

    return rows
  } catch (error) {
    return error.message
  }
}

const getNewestRecipesQuery = async (limit = 5, pageNumber) => {
  const offset = (pageNumber - 1) * limit

  try {
    const query = `SELECT id,userId,title,description,views,createdAt,mainImageUrl
    FROM recipes
    ORDER BY recipes.createdAt DESC
    LIMIT ${limit}
    OFFSET ${offset};`
    const connector = await connection
    const [rows] = await connector.execute(query)

    return rows
  } catch (error) {
    return error.message
  }
}

const getSingleRecipeByIdQuery = async (recipeId) => {
  try {
    const recipeDetailsQuery = `SELECT * 
      FROM recipes 
      WHERE recipes.id = ?;`

    const recipeInstructionsQuery = `SELECT * FROM recipe_instructions
    WHERE recipe_instructions.recipeId = ?;`

    const recipeIngredientsQuery = `SELECT 
    ingredients.name 'name',ingredients.id 'ingredientId',
    measuring_units.name 'measureUnit',measuring_units.id 'measureUnitId',
    recipe_ingredients.qty 'amount',recipe_ingredients.note,
    recipe_ingredients.title,recipe_ingredients.id 'recipeIngredientId'
    FROM recipes
    JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipeId
    JOIN ingredients on ingredients.id = recipe_ingredients.ingredientId
    JOIN measuring_units on measuring_units.id = recipe_ingredients.measureUnitId
    WHERE recipes.id = ?;`

    const recipeImagesQuery = `SELECT url FROM recipe_images where recipeId = ?`

    const recipeCategoryQuery = `SELECT id 'value',label
    FROM categories
    where id = (
    SELECT categoryId
    FROM recipe_categories
    WHERE recipeId = ?
    ); `

    const recipeCommentsQuery = `SELECT recipes_comments.id,content,createdAt,users.firstName,users.lastName  
    FROM recipes_comments
    JOIN users
    on users.id = recipes_comments.userId
    WHERE recipeId = ?;`

    const connector = await connection

    const [recipeDetails] = await connector.execute(recipeDetailsQuery, [
      recipeId,
    ])
    const [recipeInstructions] = await connector.execute(
      recipeInstructionsQuery,
      [recipeId]
    )
    const [recipeIngredients] = await connector.execute(
      recipeIngredientsQuery,
      [recipeId]
    )

    const [recipeImages] = await connector.execute(recipeImagesQuery, [
      recipeId,
    ])

    const [recipeCategory] = await connector.execute(recipeCategoryQuery, [
      recipeId,
    ])

    const [recipeComments] = await connector.execute(recipeCommentsQuery, [
      recipeId,
    ])

    const recipeData = arrangeRecipeData({
      recipeDetails,
      recipeInstructions,
      recipeIngredients,
      recipeImages,
      recipeCategory,
      recipeComments,
    })
    return recipeData
  } catch (error) {
    return error.message
  }
}

const updateSingleRecipeViewsByIdQuery = async (recipeId) => {
  try {
    const query = `UPDATE recipes 
      SET views = views + 1 
      WHERE recipes.id = ?;`

    const connector = await connection

    const [updatedRecipe] = await connector.execute(query, [recipeId])
    return updatedRecipe
  } catch (error) {
    return error.message
  }
}

// CATEGORIES API

const getAllCategoriesQuery = async () => {
  try {
    const connector = await connection
    const [rows] = await connector.execute("SELECT * FROM `categories`")
    return rows
  } catch (error) {
    return error.message
  }
}

const getAllCategoriesOfUserRecipesQuery = async (userID) => {
  try {
    const query = `SELECT id as 'value',label
    FROM categories
    WHERE id IN
        (
          SELECT categoryId 
                FROM recipe_categories
                WHERE recipeId IN (
            SELECT recipes.id
                    FROM recipes
                    WHERE recipes.userId = ?
                )
        );`
    const connector = await connection
    const [categoriesOfUserRecipes] = await connector.execute(query, [userID])
    return categoriesOfUserRecipes
  } catch (error) {
    return error.message
  }
}

// Measure Units API

const getAllMeasureUnitsQuery = async () => {
  try {
    const connector = await connection
    const [rows] = await connector.execute(
      "SELECT id 'value',name 'label' FROM `measuring_units`"
    )
    return rows
  } catch (error) {
    return error.message
  }
}

// Measure Units API

const getAllIngredientsQuery = async () => {
  try {
    const connector = await connection
    const [rows] = await connector.execute(
      "SELECT id 'value',name 'label' FROM `ingredients`"
    )
    return rows
  } catch (error) {
    return error.message
  }
}

module.exports = {
  registerUserQuery,
  userExistQuery,
  loginUserQuery,
  getAllCategoriesQuery,
  getRecipesQuery,
  getRecipesOfCategoryQuery,
  getRecipeBySearchTermQuery,
  getUserRecipesOfCategoryQuery,
  getAllCategoriesOfUserRecipesQuery,
  getRecipesOfUserQuery,
  getPopularRecipesQuery,
  getNewestRecipesQuery,
  getSingleRecipeByIdQuery,
  getAllMeasureUnitsQuery,
  getAllIngredientsQuery,
  updateSingleRecipeViewsByIdQuery,
}
