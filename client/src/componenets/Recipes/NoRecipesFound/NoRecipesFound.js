import React from "react"
import { Link } from "react-router-dom"

const NoRecipesFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center my-3">
      <h4 className="my-2"> אין מתכונים 😥😥</h4>
      <Link className="btn btn-outline-warning" to="/recipes/new/details">
        הוסף מתכון חדש 🤩
      </Link>
    </div>
  )
}

export default NoRecipesFound
