import React from "react"
import { Link } from "react-router-dom"
import { Container } from "react-bootstrap"

const ErrorPage = () => {
  return (
    <Container className="text-center mt-5">
      <h2 className="text-center">נראה שהלכת לאיבוד.... 🙄🙄</h2>
      <Link to="/" className="btn btn-outline-danger btn-lg my-3">
        לדף הבית <i className="fas fa-home"></i>
      </Link>
    </Container>
  )
}

export default ErrorPage
