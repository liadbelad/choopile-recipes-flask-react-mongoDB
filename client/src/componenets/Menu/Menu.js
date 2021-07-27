import React from "react"
import { Link } from "react-router-dom"
import styles from "./Menu.module.scss"
import { Link as ScrollLink } from "react-scroll"

const Menu = () => {
  return (
    <div className={`${styles["menu-container"]} pt-1 mt-3`}>
      <ScrollLink
        to="newestRecipesGallery"
        className=" font-weight-bold"
        smooth
        duration={800}
      >
        הכי חדשים <i className="fas fa-arrow-down"></i>
      </ScrollLink>
      <Link to="/recipes" className="font-weight-bold">
        כל המתכונים
      </Link>
    </div>
  )
}

export default React.memo(Menu)
