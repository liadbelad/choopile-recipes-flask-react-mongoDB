import React from "react"
import { Link } from "react-router-dom"
import { Container } from "react-bootstrap"

const NewRecipeErrorPage = () => {
  return (
    <Container className="text-center mt-5">
      <h2 className="text-center">שגיאה בתהליך יצירת המתכון .... 🙄🙄</h2>
      <p className="text-center">
        אנו מתנצלים אבל נראה שהאתר התרענן והמידע לא נשמר
      </p>
      <Link
        to="/recipes/new/details"
        className="btn btn-outline-danger btn-lg my-3"
      >
        נסה שוב<i className="fas fa-home"></i>
      </Link>
    </Container>
  )
}

export default NewRecipeErrorPage
