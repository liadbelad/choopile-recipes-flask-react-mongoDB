import React, { useContext } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import { Link } from "react-router-dom"
import addRecipeImg from "../../../utills/images/add-recipe.png"
import profileIcon from "../../../utills/images/profile-icon.png"
import myRecipesIcon from "../../../utills/images/my-recipes-icon.png"
import logoutIcon from "../../../utills/images/logout-icon.png"
import AuthContext from "../../../store/AuthCtx/auth-context"

const UserInfoDropDownItem = ({ linkTo, text, image, onClick }) => {
  return (
    <Dropdown.Item
      as={Link}
      to={linkTo}
      className="d-flex mb-2"
      onClick={onClick}
    >
      <img src={image} alt="add recipe" width="25px" height="25px" />
      <span className="ml-2"> {text} </span>
    </Dropdown.Item>
  )
}

const UserInfoDropdown = () => {
  const { handleLogout, userFirstName } = useContext(AuthContext)

  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-userInfo">
        אזור אישי <i className="fas fa-user"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu className="text-right" style={{ width: "200px" }}>
        <Dropdown.Header>
          <h5>שלום {userFirstName || storedUserInfo?.firstName}</h5>
        </Dropdown.Header>
        <UserInfoDropDownItem
          text="הוסף מתכון"
          linkTo="/recipes/new/details"
          image={addRecipeImg}
        />
        <UserInfoDropDownItem
          text="המתכונים שלי"
          linkTo="/my-recipes"
          image={myRecipesIcon}
        />
        <UserInfoDropDownItem
          text="הפרופיל שלי"
          linkTo="/profile"
          image={profileIcon}
        />
        <UserInfoDropDownItem
          text="התנתק"
          linkTo="/"
          onClick={handleLogout}
          image={logoutIcon}
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default UserInfoDropdown
