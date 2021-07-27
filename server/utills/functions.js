function isInt(num) {
  return Number(num) === num && num % 1 === 0
}

function isFloat(num) {
  return Number(num) === num && num % 1 !== 0
}

const arrangeRecipeData = ({
  recipeDetails,
  recipeInstructions,
  recipeIngredients,
  recipeImages,
  recipeCategory,
  recipeComments,
}) => {
  const arrangedRecipeData = { ...recipeDetails[0] }
  arrangedRecipeData.images = [...recipeImages]
  arrangedRecipeData.comments = [...recipeComments]

  arrangeRecipeInstructions(arrangedRecipeData, recipeInstructions)

  arrangeRecipeIngredients(arrangedRecipeData, recipeIngredients)

  arrangedRecipeData.categories = { ...recipeCategory[0] }

  return arrangedRecipeData
}

const findIngredientsOfTitle = (ingredientsByTitle, title) => {
  return ingredientsByTitle.find(
    ({ title: titleToFind }) => titleToFind === title
  )
}

const arrangeRecipeInstructions = (arrangedRecipeData, recipeInstructions) => {
  arrangedRecipeData.instructions = recipeInstructions.map(
    ({ id, instruction }) => ({ id, instruction })
  )
}

const arrangeRecipeIngredients = (arrangedRecipeData, recipeIngredients) => {
  const ingredientTitles = {}

  arrangedRecipeData.ingredientsByTitle = []
  for (const {
    title,
    name,
    amount: decimalAmount,
    measureUnit,
    measureUnitId,
    ingredientId,
    note,
    recipeIngredientId,
  } of recipeIngredients) {
    const amount = isFloat(decimalAmount)
      ? decimalAmount.replace(/(\.0+|0+)$/, "")
      : decimalAmount

    if (title in ingredientTitles) {
      const { ingredientsByTitle } = arrangedRecipeData

      const ingredientsTitleCurrent = findIngredientsOfTitle(
        ingredientsByTitle,
        title
      )

      const { ingredients } = ingredientsTitleCurrent

      ingredients.push({
        recipeIngredientId,
        ingredient: { label: name, value: ingredientId },
        amount,
        measureUnit: { value: measureUnitId, label: measureUnit },
        note,
      })

      continue
    }

    ingredientTitles[title] = title
    arrangedRecipeData.ingredientsByTitle.push({
      title,
      ingredients: [
        {
          recipeIngredientId,
          ingredient: { label: name, value: ingredientId },
          measureUnit: { value: measureUnitId, label: measureUnit },
          amount,
          note,
        },
      ],
    })
  }
}

module.exports = { arrangeRecipeData }
