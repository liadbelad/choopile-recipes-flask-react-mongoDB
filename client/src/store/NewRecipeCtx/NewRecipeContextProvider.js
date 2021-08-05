import React, { useState, useEffect } from "react"
import { addNewRecipe, updateRecipe } from "../../DAL/recipesApi"
import {
  addNewArrayDataToFormData,
  appendDataToFormData,
} from "../../utills/js/functions"
import newRecipeContext from "./new-recipe-context"

const AuthContextProvider = ({ children }) => {
  const [recipeDetails, setRecipeDetails] = useState({})
  const [recipeIngredients, setRecipeIngredients] = useState({})
  const [recipeInstructions, setRecipeInstructions] = useState({})
  const [fullRecipeData, setFullRecipeData] = useState(new FormData())

  const handleAddRecipeDetails = (newRecipeDetails) => {
    setRecipeDetails(newRecipeDetails)

    const {
      categories: { value: categoryID },
      ...restRecipeDetails
    } = newRecipeDetails

    restRecipeDetails.category = categoryID

    const formData = appendDataToFormData(fullRecipeData, restRecipeDetails)
    setFullRecipeData(formData)
    localStorage.setItem("recipeDetails", JSON.stringify(newRecipeDetails))
  }

  const handleAddRecipeIngredients = (newRecipeIngredients) => {
    setRecipeIngredients(newRecipeIngredients)

    console.log(newRecipeIngredients)

    // const transformedRecipeIngredients = newRecipeIngredients.map(
    //   (ingredientData) => {
    //     return {
    //       action: ingredientData.action || null,
    //       amount: ingredientData.qty,
    //       measureUnitId: ingredientData.measureUnit.value,
    //       ingredientId: ingredientData.ingredient.value,
    //       title: ingredientData.title || "",
    //       note: ingredientData.note || "",
    //       recipeIngredientId: ingredientData.recipeIngredientId || null,
    //     }
    //   }
    // )

    const findIngredientsOfTitle = (ingredientsByTitle, title) => {
      return ingredientsByTitle.find(
        ({ title: titleToFind }) => titleToFind === title
      )
    }

    const ingredientTitles = {}
    const ingredientsByTitle = []
    for (const {
      title,
      qty: amount,
      measureUnit,
      ingredient,
      note,
    } of newRecipeIngredients) {
      if (title in ingredientTitles) {
        const ingredientsTitleCurrent = findIngredientsOfTitle(
          ingredientsByTitle,
          title
        )

        const { ingredients } = ingredientsTitleCurrent
        ingredients.push({
          ingredient,
          measureUnit,
          amount,
          note,
        })
        continue
      }
      ingredientTitles[title] = title
      ingredientsByTitle.push({
        title,
        ingredients: [
          {
            ingredient,
            measureUnit,
            amount,
            note,
          },
        ],
      })
    }

    console.log(ingredientsByTitle)

    addNewArrayDataToFormData(
      fullRecipeData,
      "ingredientsByTitle",
      ingredientsByTitle
    )
    localStorage.setItem(
      "recipeIngredients",
      JSON.stringify(newRecipeIngredients)
    )
  }

  const handleAddRecipeInstructions = (newRecipeInstructions, userID) => {
    setRecipeInstructions(newRecipeInstructions)

    addNewArrayDataToFormData(
      fullRecipeData,
      "instructions",
      newRecipeInstructions
    )

    fullRecipeData.set("userId", userID)

    localStorage.setItem(
      "recipeInstructions",
      JSON.stringify(newRecipeInstructions)
    )
  }

  const handleAddNewRecipe = async () => {
    const newRecipeId = await addNewRecipe(fullRecipeData)
    return newRecipeId
  }

  const handleUpdateRecipe = (recipeId) => {
    updateRecipe(fullRecipeData, recipeId)
  }

  useEffect(() => {
    const storedRecipeDetails = JSON.parse(
      localStorage.getItem("recipeDetails")
    )
    if (storedRecipeDetails) {
      setRecipeDetails(storedRecipeDetails)
    }
  }, [])

  return (
    <newRecipeContext.Provider
      value={{
        recipeDetails,
        recipeIngredients,
        recipeInstructions,
        newRecipe: fullRecipeData,
        handleAddRecipeDetails,
        handleAddRecipeIngredients,
        handleAddRecipeInstructions,
        handleAddNewRecipe,
        handleUpdateRecipe,
      }}
    >
      {children}
    </newRecipeContext.Provider>
  )
}

export default AuthContextProvider
