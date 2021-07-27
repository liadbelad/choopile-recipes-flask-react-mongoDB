import React, { useState, useEffect } from "react"
import useHttp from "../hooks/use-http"
import { Container, Row, Col } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import SearchBar from "../componenets/SearchBar/SearchBar"
import CategoriesList from "../componenets/CategoriesList/CategoriesList"
import RecipesList from "../componenets/Recipes/RecipesList/RecipesList"
import Loader from "../componenets/Loader/Loader"
import Message from "../componenets/Message/Message"
import NoRecipesFound from "../componenets/Recipes/NoRecipesFound/NoRecipesFound"
import { getUserRecipes } from "../DAL/api"
import Paginate from "../componenets/Pagination/Paginate"
import Aos from "aos"
import "aos/dist/aos.css"

const MyRecipesPage = () => {
  const [activePageNumber, setActivePageNumber] = useState(1)
  const [isCategoryActive, setIsCategoryActive] = useState(false)

  const {
    sendRequest: sendUserRecipesRequest,
    status: userRecipesStatus,
    data: userRecipesData,
    error: userRecipesError,
  } = useHttp(getUserRecipes)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  const history = useHistory()

  const handleGetUserRecipesBySelectedCategory = (categoryID) => {
    setIsCategoryActive(true)
    setActivePageNumber(1)
    sendUserRecipesRequest({ activePageNumber, categoryID })
  }

  const handleShowRecipesByPageNumber = (pageNumber) => {
    setActivePageNumber(pageNumber)
  }

  useEffect(() => {
    if (!userInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
      return
    }
    if (!isCategoryActive) {
      sendUserRecipesRequest({ activePageNumber })
    }
  }, [isCategoryActive, sendUserRecipesRequest, activePageNumber])

  useEffect(() => {
    Aos.init({ duration: 1500 })
  }, [])

  if (
    userRecipesStatus === "completed" &&
    (!userRecipesData || userRecipesData.length === 0)
  ) {
    return <NoRecipesFound />
  }

  return (
    <>
      <Container fluid className="my-5">
        <Row>
          <Col md={4}>
            <SearchBar sm={12} />
            <CategoriesList
              onCategoryChange={handleGetUserRecipesBySelectedCategory}
            />
          </Col>
          <Col md={8} style={{ minHeight: "75vh" }} data-aos="fade-up">
            {userRecipesStatus === "pending" && <Loader />}

            {userRecipesError && <Message> {userRecipesError} </Message>}

            {userRecipesData?.userRecipes?.length > 0 && (
              <RecipesList recipes={userRecipesData.userRecipes} />
            )}

            {userRecipesData && userRecipesData?.userRecipes?.length === 0 && (
              <NoRecipesFound />
            )}
          </Col>
        </Row>
        {userRecipesData && userRecipesData.pagesCount && (
          <Paginate
            onClick={handleShowRecipesByPageNumber}
            pagesCount={userRecipesData.pagesCount}
            activePageNumber={activePageNumber}
          />
        )}
      </Container>
    </>
  )
}

export default MyRecipesPage
