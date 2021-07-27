import React, { useEffect, useContext } from "react"
import { useLocation } from "react-router-dom"
import useHttp from "../../hooks/use-http"
import Select from "react-select"
import { getAllCategories, getAllCategoriesOfUserRecipes } from "../../DAL/api"
import AuthContext from "../../store/AuthCtx/auth-context"
import { CUSTOM_SELECT_STYLES } from "../../utills/js/constants"

const CategoriesList = ({ onCategoryChange }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { isLoggedIn } = useContext(AuthContext)

  const location = useLocation()

  const { pathname } = location

  const requestToSend =
    pathname === "/my-recipes"
      ? getAllCategoriesOfUserRecipes
      : getAllCategories

  const { sendRequest, data: loadedCategories } = useHttp(requestToSend)

  const handleCategoryChange = async (selectedCategory) => {
    const categoryID = selectedCategory.value
    onCategoryChange(categoryID)
  }

  useEffect(() => {
    if (isLoggedIn) {
      sendRequest(userInfo.id)
    } else {
      sendRequest()
    }
  }, [sendRequest, isLoggedIn])

  return (
    <Select
      placeholder="קטגוריות"
      options={loadedCategories}
      onChange={handleCategoryChange}
      className="my-3"
      styles={CUSTOM_SELECT_STYLES}
    />
  )
}

export default CategoriesList
