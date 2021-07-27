import React from "react"
import { useLocation } from "react-router-dom"
import { ListGroup } from "react-bootstrap"
import styles from "./NewIngredientsList.module.scss"

const NewIngredientItem = ({
  ingredientData,
  idx,
  handleDeleteNewIngredient,
  handleEditNewIngredient,
}) => {
  const { pathname } = useLocation()
  return (
    <ListGroup.Item key={idx} idx={idx} className={styles["listgroup-item"]}>
      <div>
        <i
          onClick={handleDeleteNewIngredient}
          style={{ cursor: "pointer", color: "red" }}
          className="fas fa-trash mx-2"
        ></i>
        {pathname === "/recipes/new/ingredients" && (
          <i
            onClick={handleEditNewIngredient}
            style={{ cursor: "pointer", color: "#ffb605" }}
            className="fas fa-edit mx-2"
          ></i>
        )}
      </div>
      <p> {ingredientData.qty} </p>
      <p> {ingredientData.measureUnit.label} </p>
      <p> {ingredientData.ingredient.label} </p>
      <p> {ingredientData.note} </p>
    </ListGroup.Item>
  )
}

const NewIngredientsList = ({
  newRecipeIngredients,
  handleDeleteNewIngredient,
  handleEditNewIngredient,
}) => {
  return (
    <ListGroup>
      {newRecipeIngredients.map((ingredientData, idx) => (
        <NewIngredientItem
          ingredientData={ingredientData}
          idx={idx}
          key={idx}
          handleDeleteNewIngredient={() =>
            handleDeleteNewIngredient(ingredientData.ingredient.value)
          }
          handleEditNewIngredient={() =>
            handleEditNewIngredient(ingredientData, idx)
          }
        />
      ))}
    </ListGroup>
  )
}

export default NewIngredientsList
