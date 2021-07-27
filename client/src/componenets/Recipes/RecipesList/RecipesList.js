import React from "react"
import RecipeCard from "../RecipeGallery/RecipeCard/RecipeCard"
import RecipeItem from "../RecipeItem/RecipeItem"
import styles from "./RecipesList.module.scss"

const RecipesList = ({ recipes = [], className = "grid-container" }) => {
  const recipesToShow =
    className === "grid-container"
      ? recipes.map((recipe) => <RecipeItem key={recipe.id} recipe={recipe} />)
      : recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)

  return <section className={styles[className]}>{recipesToShow}</section>
}

export default RecipesList
