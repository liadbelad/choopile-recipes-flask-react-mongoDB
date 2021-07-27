import React from "react"
import Container from "react-bootstrap/Container"
import SearchBar from "../SearchBar/SearchBar"
import styles from "./Header.module.scss"

const Header = () => {
  return (
    <Container fluid className={`${styles.header} mt-2`}>
      <h2 className="mb-3">חפש מתכון</h2>
      <SearchBar md={6} lg={7} />
    </Container>
  )
}

export default React.memo(Header)
