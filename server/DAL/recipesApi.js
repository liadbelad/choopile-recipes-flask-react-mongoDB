const connection = require("../config/db")

const addNewRecipe = async (newRecipe) => {
  const {
    userId,
    title,
    description,
    servings,
    category: categoryId,
    prepTimeMins,
    ingredients,
    instructions,
    imageURL,
  } = newRecipe

  const newRecipeDetailsQuery = `INSERT INTO recipes
    (userId,title,description,servings,prepTimeMins,mainImageUrl)
    VALUES(?,?,?,?,?,?)`

  const connector = await connection

  const [{ insertId: recipeId }] = await connector.execute(
    newRecipeDetailsQuery,
    [userId, title, description, servings, prepTimeMins, imageURL]
  )

  const ingredientsArr = JSON.parse(ingredients)
  ingredientsArr.forEach((ingredient) =>
    addNewRecipeIngredient(ingredient, recipeId)
  )

  const instructionsArr = JSON.parse(instructions)
  instructionsArr.forEach(({ instruction }) =>
    addNewRecipeInstruction(instruction, recipeId)
  )

  const addCategoryQuery = `INSERT INTO recipe_categories (recipeId,categoryid)
  VALUES(?,?)`

  await connector.execute(addCategoryQuery, [recipeId, categoryId])

  const addImageQuery = `INSERT INTO recipe_images (recipeId,url)
  VALUES(?,?)`

  await connector.execute(addImageQuery, [recipeId, imageURL])

  return recipeId
}

const addNewRecipeIngredient = async (ingredient, recipeId) => {
  const { ingredientId, amount, measureUnitId, title, note } = ingredient

  const addIngredientQuery = `INSERT INTO recipe_ingredients 
  (ingredientId,recipeId,measureUnitId,qty,title,note)
  VALUES(?,?,?,?,?,?) `

  const connector = await connection

  await connector.execute(addIngredientQuery, [
    ingredientId,
    recipeId,
    measureUnitId,
    amount,
    title,
    note,
  ])
}

const addNewRecipeInstruction = async (instruction, recipeId) => {
  const addInstructionQuery = `INSERT INTO recipe_instructions 
  (recipeId,instruction)
  VALUES(?,?) `

  const connector = await connection

  await connector.execute(addInstructionQuery, [recipeId, instruction])
}

const updateRecipe = async (updatedRecipe, recipeId) => {
  const {
    userId,
    title,
    description,
    servings,
    category: categoryId,
    prepTimeMins,
    ingredients,
    instructions,
    imageURL,
  } = updatedRecipe

  const updateRecipeDetailsQuery = `UPDATE recipes
    SET userId = ?,title = ?,description = ?,servings = ? ,prepTimeMins = ?,mainImageUrl = ?
    WHERE recipes.id = ?;`

  const connector = await connection

  await connector.execute(updateRecipeDetailsQuery, [
    userId,
    title,
    description,
    servings,
    prepTimeMins,
    imageURL,
    recipeId,
  ])
  const ingredientsArr = JSON.parse(ingredients)
  ingredientsArr.forEach((ingredient) => {
    if (ingredient.action === "INSERT") {
      addNewRecipeIngredient(ingredient, recipeId)
    }
    if (ingredient.action === "DELETE") {
      deleteRecipeIngredient(ingredient.recipeIngredientId)
    }
    if (ingredient.action === "UPDATE") {
      updateRecipeIngredient(ingredient, recipeId)
    }
  })

  const instructionsArr = JSON.parse(instructions)
  instructionsArr.forEach(({ id, instruction, action }) => {
    if (action === "INSERT") {
      addNewRecipeInstruction(instruction, recipeId)
    }
    if (action === "DELETE") {
      deleteRecipeInstruction(id)
    }
    if (action === "UPDATE") {
      updateRecipeInstrucion(id, instruction, recipeId)
    }
  })

  const updateCategoryQuery = `UPDATE recipe_categories 
  SET categoryid = ? WHERE recipeId = ?`

  await connector.execute(updateCategoryQuery, [categoryId, recipeId])

  const updateImageQuery = `UPDATE recipe_images 
  SET url = ? WHERE recipeId = ?`

  await connector.execute(updateImageQuery, [imageURL, recipeId])
}

async function deleteRecipeIngredient(recipeIngredientId) {
  recipeIngredientId
  const deleteRecipeIngredientQuery = `DELETE FROM recipe_ingredients
  WHERE id = ?`
  const connector = await connection
  await connector.execute(deleteRecipeIngredientQuery, [recipeIngredientId])
}

async function deleteRecipeInstruction(id) {
  id
  const deleteRecipeIngredientQuery = `DELETE FROM recipe_instructions
  WHERE id = ?`
  const connector = await connection
  await connector.execute(deleteRecipeIngredientQuery, [id])
}

const updateRecipeIngredient = async (ingredient, recipeId) => {
  const {
    recipeIngredientId,
    ingredientId,
    amount,
    measureUnitId,
    title,
    note,
  } = ingredient

  const updateIngredientQuery = `UPDATE recipe_ingredients 
  SET ingredientId = ?,measureUnitId = ?,qty = ?,title = ?,note = ?
  WHERE id = ? AND recipeId = ?`

  const connector = await connection

  await connector.execute(updateIngredientQuery, [
    ingredientId,
    measureUnitId,
    amount,
    title,
    note,
    recipeIngredientId,
    recipeId,
  ])
}

const updateRecipeInstrucion = async (id, instruction, recipeId) => {
  const updateInstructionQuery = `UPDATE recipe_instructions 
  SET instruction = ?
  WHERE id = ? AND recipeId = ? `

  const connector = await connection

  await connector.execute(updateInstructionQuery, [instruction, id, recipeId])
}

const addRecipeCommentForUser = async (recipeId, userId, content) => {
  const insertCommentQuery = `INSERT INTO recipes_comments(recipeId,userId,content)
  VALUES(?,?,?)`

  const connector = await connection

  await connector.execute(insertCommentQuery, [recipeId, userId, content])

  const getCommentsOfRecipeQuery = `SELECT recipes_comments.id,content,createdAt,users.firstName,users.lastName  
  FROM recipes_comments
  JOIN users
  on users.id = recipes_comments.userId
  WHERE recipeId = ?;`

  const [recipeComments] = await connector.execute(getCommentsOfRecipeQuery, [
    recipeId,
  ])

  return recipeComments
}

const checkIfUserCommentedToRecipe = async (recipeId, userId) => {
  const getCommentsOfRecipeQuery = `SELECT * FROM recipes_comments WHERE recipeId = ? AND userId = ?`

  const connector = await connection
  const [comment] = await connector.execute(getCommentsOfRecipeQuery, [
    recipeId,
    userId,
  ])

  return comment
}

const getNumberOfPagesQuery = async ({ pageSize: limit, category, userId }) => {
  if (!category && !userId) {
    const countRecipesQuery = `SELECT COUNT(id) AS NumberOfRecipes FROM recipes;`
    const connector = await connection
    const [recipesCount] = await connector.execute(countRecipesQuery)
    const { NumberOfRecipes } = recipesCount[0]

    const pagesCount = Math.ceil(NumberOfRecipes / limit)

    return { pagesCount }
  }

  if (category && !userId) {
    const countRecipesQuery = `SELECT COUNT(recipeId) AS NumberOfRecipes 
    FROM recipe_categories
    WHERE categoryId = ?;`
    const connector = await connection
    const [recipesCount] = await connector.execute(countRecipesQuery, [
      category,
    ])
    const { NumberOfRecipes } = recipesCount[0]

    const pagesCount = Math.ceil(NumberOfRecipes / limit)

    return { pagesCount }
  }

  if (!category && userId) {
    const countRecipesQuery = `SELECT COUNT(id) AS NumberOfRecipes 
    FROM recipes
    WHERE userId = ?;`
    const connector = await connection
    const [recipesCount] = await connector.execute(countRecipesQuery, [userId])
    const { NumberOfRecipes } = recipesCount[0]

    const pagesCount = Math.ceil(NumberOfRecipes / limit)

    return { pagesCount }
  }

  const countRecipesQuery = `SELECT count(id) As NumberOfRecipes 
  FROM recipes
  WHERE userId = ? 
  AND id 
  IN(
  SELECT recipe_categories.recipeId 
      FROM recipe_categories
      WHERE categoryId = ?
  );`
  const connector = await connection
  const [recipesCount] = await connector.execute(countRecipesQuery, [
    userId,
    category,
  ])
  const { NumberOfRecipes } = recipesCount[0]

  const pagesCount = Math.ceil(NumberOfRecipes / limit)

  return { pagesCount }
}

module.exports = {
  addNewRecipe,
  updateRecipe,
  addRecipeCommentForUser,
  checkIfUserCommentedToRecipe,
  getNumberOfPagesQuery,
}
