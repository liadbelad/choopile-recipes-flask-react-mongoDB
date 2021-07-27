import React from "react"
import { ListGroup } from "react-bootstrap"

const IngredientsByTitleList = ({ title, ingredients }) => {
  return (
    <ListGroup className="mb-3">
      {title && <h6 className="font-weight-bold"> {title}: </h6>}
      {ingredients.map(({ amount, measureUnit, ingredient, note }, idx) => (
        <ListGroup.Item key={idx} style={{ border: "none" }}>
          <i
            className="fas fa-utensils"
            style={{ color: "rgb(239, 66, 41)" }}
          ></i>
          <span className="mr-2">
            {amount} {measureUnit.label + " "}
            {ingredient.label}
          </span>
          {note && (
            <small className="text-danger" style={{ fontSize: "0.7rem" }}>
              (*{note})
            </small>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

const RecipeIngredients = ({ ingredientsByTitle }) => {
  const ingredientsByTitleElements = ingredientsByTitle.map(
    ({ title, ingredients }, idx) => (
      <IngredientsByTitleList
        key={idx}
        title={title}
        ingredients={ingredients}
      />
    )
  )

  return (
    <>
      <h2> החומרים </h2> {ingredientsByTitleElements}
    </>
  )
}

export default RecipeIngredients
