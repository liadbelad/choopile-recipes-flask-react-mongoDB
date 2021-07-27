const validation = (schema) => async (req, res, next) => {
  try {
    if (req.body.ingredients) {
      convertStringNumbersToNumbers(req.body)
    }
    const body = req.body
    await schema.validate(body)
    next()
  } catch (error) {
    res
      .status(401)
      .json({ error: true, name: error.path, message: error.message })
  }
}

const convertStringNumbersToNumbers = (recipe) => {
  const { servings, prepTimeMins, category, userId } = recipe
  recipe.servings = +servings
  recipe.prepTimeMins = +prepTimeMins
  recipe.category = +category
  recipe.userId = +userId
}

module.exports = validation
