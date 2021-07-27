import React, { useState, useContext } from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Navbar, Nav, Container } from "react-bootstrap"
import ModalContext from "../../store/ModalCtx/modal-context"
import AuthContext from "../../store/AuthCtx/auth-context"
import styles from "./MainNavbar.module.scss"
import Sidebar from "../Sidebar/Sidebar"
import RegisterLoginLinks from "../RegisterLoginLinks/RegisterLoginLinks"
import UserInfoDropdown from "./UserInfo/UserInfoDropdown"
import SocialLinks from "../SocialLinks/SocialLinks"
import { animateScroll as scroll } from "react-scroll"

const MainNavbar = () => {
  const [showSidebar, setShowSidebar] = useState(false)

  const { handleModalContent, handleOpenModal } = useContext(ModalContext)

  const { isLoggedIn } = useContext(AuthContext)

  const handleOpenModalWithContent = (e) => {
    handleOpenModal()
    handleModalContent(e.target.name)
  }

  const handleShowSidenav = () => {
    setShowSidebar((prevShowSidenav) => !prevShowSidenav)
  }

  return (
    <>
      <Navbar
        className={`${styles["navbar-container"]} fixed-top`}
        style={{ background: "#fff" }}
        variant="light"
        collapseOnSelect
      >
        <i
          className="fas fa-bars btn btn-outline-danger"
          onClick={handleShowSidenav}
        ></i>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-between w-100">
              {isLoggedIn ? (
                <UserInfoDropdown />
              ) : (
                <RegisterLoginLinks
                  handleOpenModalWithContent={handleOpenModalWithContent}
                />
              )}

              <LinkContainer to="/">
                <Navbar.Brand
                  onClick={() => scroll.scrollToTop()}
                  className={styles.brand}
                >
                  CHOOPIL'E
                </Navbar.Brand>
              </LinkContainer>
              <div className={styles["social-links"]}>
                <SocialLinks />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Sidebar
        showSidebar={showSidebar}
        handleShowSidenav={handleShowSidenav}
        handleOpenModalWithContent={handleOpenModalWithContent}
      />
    </>
  )
}

export default MainNavbar
