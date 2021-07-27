import React from "react"
import Nav from "react-bootstrap/Nav"

const SocialLinks = () => {
  return (
    <>
      <Nav.Link href="https://www.facebook.com/" target="_blank">
        <i className="fab fa-facebook"></i>
      </Nav.Link>
      <Nav.Link href="https://www.instagram.com/" target="_blank">
        <i className="fab fa-instagram"></i>
      </Nav.Link>
      <Nav.Link href="https://www.twitter.com/" target="_blank">
        <i className="fab fa-twitter"></i>
      </Nav.Link>
    </>
  )
}

export default SocialLinks
