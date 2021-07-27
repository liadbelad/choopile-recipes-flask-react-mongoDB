import React, { useState, useEffect } from "react"
import useHttp from "../hooks/use-http"
import { Container, Row, Col } from "react-bootstrap"
import SearchBar from "../componenets/SearchBar/SearchBar"
import CategoriesList from "../componenets/CategoriesList/CategoriesList"
import RecipesList from "../componenets/Recipes/RecipesList/RecipesList"
import Loader from "../componenets/Loader/Loader"
import Message from "../componenets/Message/Message"
import NoRecipesFound from "../componenets/Recipes/NoRecipesFound/NoRecipesFound"
import { getAllRecipes } from "../DAL/api"
import Paginate from "../componenets/Pagination/Paginate"
import Aos from "aos"
import "aos/dist/aos.css"

const RecipesPage = () => {
  const [activePageNumber, setActivePageNumber] = useState(1)
  const [activeCategory, setActiveCategory] = useState(false)

  const {
    sendRequest: sendAllRecipesRequest,
    status: allRecipesStatus,
    data: allRecipes,
    error: allRecipesError,
  } = useHttp(getAllRecipes, true)

  const handleGetRecipesBySelectedCategory = (categoryID) => {
    setActivePageNumber(1)

    setActiveCategory(categoryID)

    sendAllRecipesRequest({ activePageNumber, categoryID })
  }

  const handleShowRecipesByPageNumber = (pageNumber) => {
    setActivePageNumber(pageNumber)
  }

  useEffect(() => {
    if (!activeCategory) {
      sendAllRecipesRequest({ activePageNumber })
    } else {
      const categoryID = activeCategory
      sendAllRecipesRequest({ activePageNumber, categoryID })
    }
  }, [activeCategory, sendAllRecipesRequest, activePageNumber])

  useEffect(() => {
    Aos.init({ duration: 1500 })
  }, [])

  if (
    allRecipesStatus === "completed" &&
    (!allRecipes || allRecipes.length === 0)
  ) {
    return <NoRecipesFound />
  }

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={4} className="w-100">
          <SearchBar sm={12} />
          <CategoriesList
            onCategoryChange={handleGetRecipesBySelectedCategory}
          />
        </Col>
        <Col md={8} style={{ minHeight: "75vh" }} data-aos="fade-up">
          {allRecipesStatus === "pending" && <Loader />}

          {allRecipesError && <Message> {allRecipesError} </Message>}

          {allRecipes?.recipes.length === 0 && <NoRecipesFound />}

          {allRecipes && allRecipes?.recipes.length > 0 && (
            <RecipesList recipes={allRecipes.recipes} />
          )}
        </Col>
      </Row>

      {allRecipes && allRecipes.pagesCount && (
        <Paginate
          onClick={handleShowRecipesByPageNumber}
          pagesCount={allRecipes.pagesCount}
          activePageNumber={activePageNumber}
        />
      )}
    </Container>
  )
}

export default RecipesPage
