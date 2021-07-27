import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Nav } from "react-bootstrap"
import { useLocation } from "react-router-dom"

const NewRecipeSteps = ({ step1, step2, step3, path = "new" }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to={`/recipes/${path}/details`}>
            <Nav.Link className="font-weight-bold">פרטי מתכון</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>פרטי מתכון</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to={`/recipes/${path}/ingredients`}>
            <Nav.Link className="font-weight-bold">מרכיבים</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>מרכיבים</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to={`/recipes/${path}/instructions`}>
            <Nav.Link className="font-weight-bold">הוראות הכנה</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>הוראות הכנה</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default NewRecipeSteps
