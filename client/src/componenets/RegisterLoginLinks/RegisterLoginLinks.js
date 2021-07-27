import React from "react"
import Nav from "react-bootstrap/Nav"

const RegisterLoginLinks = ({ handleOpenModalWithContent }) => {
  return (
    <div className="d-flex">
      <Nav.Link name="login" onClick={handleOpenModalWithContent}>
        התחבר
      </Nav.Link>
      <Nav.Link disabled> | </Nav.Link>
      <Nav.Link name="register" onClick={handleOpenModalWithContent}>
        הרשם
      </Nav.Link>
    </div>
  )
}

export default RegisterLoginLinks
