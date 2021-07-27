import React from "react"

// App wide state
const newRecipeContext = React.createContext({
  newRecipe: [],
  recipeDetails: {},
  recipeIngredients: {},
  recipeInstructions: {},
  handleAddRecipeDetails: (newRecipeDetails) => {},
  handleAddRecipeIngredients: (newRecipeIngredients) => {},
  handleAddRecipeInstructions: (newRecipeInstructions) => {},
  handleAddNewRecipe: (newRecipe) => {},
  handleUpdateRecipe: (updatedRecipe) => {},
})

export default newRecipeContext
