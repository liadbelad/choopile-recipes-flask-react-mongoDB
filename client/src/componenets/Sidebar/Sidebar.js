import React, { useContext } from "react"
import { Nav, Navbar } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import AuthContext from "../../store/AuthCtx/auth-context"
import RegisterLoginLinks from "../RegisterLoginLinks/RegisterLoginLinks"
import SocialLinks from "../SocialLinks/SocialLinks"
import styles from "./Sidebar.module.scss"

function Sidebar({
  showSidebar,
  handleShowSidenav,
  handleOpenModalWithContent,
}) {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <aside
      className={
        showSidebar
          ? `${styles["nav-menu"]} ${styles.active}`
          : styles["nav-menu"]
      }
    >
      <Nav
        className="flex-column align-items-center w-100"
        onClick={handleShowSidenav}
      >
        <Nav.Link className="h3 ml-auto w-100">&times;</Nav.Link>
        <LinkContainer to="/">
          <Navbar.Brand className={`${styles.brand} my-4`}>
            CHOOPIL'E
          </Navbar.Brand>
        </LinkContainer>
        <LinkContainer to="/recipes">
          <Nav.Link>מתכונים</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/about">
          <Nav.Link>הסיפור שלנו</Nav.Link>
        </LinkContainer>
        <div className={`${styles["social-links"]} my-3`}>
          <SocialLinks />
        </div>
        {!isLoggedIn && (
          <RegisterLoginLinks
            handleOpenModalWithContent={handleOpenModalWithContent}
          />
        )}
      </Nav>
    </aside>
  )
}

export default Sidebar
