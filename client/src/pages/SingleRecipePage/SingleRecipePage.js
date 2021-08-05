import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Container, Card, Row, Col } from "react-bootstrap"
import styles from "./SingleRecipePage.module.scss"
import RecipeIngredients from "../../componenets/Recipes/RecipeIngredientsList/RecipeIngredients"
import RecipeInstructions from "../../componenets/Recipes/RecipeInstructions/RecipeInstructions"
import { getFullRecipeDetailsByID } from "../../DAL/api"
import useHttp from "../../hooks/use-http"
import Loader from "../../componenets/Loader/Loader"
import Message from "../../componenets/Message/Message"
import ErrorPage from "../ErrorPage"
import CommentSection from "../../componenets/Recipes/RecipeComments/CommentSection"
import OverviewDetails from "./OverviewDetails/OverviewDetails"
import ShareLinks from "./ShareLinks/ShareLinks"
import Aos from "aos"
import "aos/dist/aos.css"

const SingleRecipePage = () => {
  const {
    sendRequest,
    data: recipe,
    error,
    status,
  } = useHttp(getFullRecipeDetailsByID, true)
  const { id } = useParams()

  useEffect(() => {
    sendRequest(id)
  }, [id, sendRequest])

  useEffect(() => {
    Aos.init({ duration: 750 })
  }, [])

  if (status === "pending") {
    return (
      <div className="my-5 d-flex justify-content-center">
        <Loader />
      </div>
    )
  }

  if (!id || !recipe?._id) {
    return <ErrorPage />
  }

  console.log(recipe)

  return (
    <>
      {status === "pending" && <Loader />}
      {error && <Message> {error} </Message>}

      {recipe && (
        <Container className="my-5">
          <section className="w-100 d-flex flex-column justify-content-center align-items-center ">
            <Card.Title as="h1" className="mb-4" data-aos="fade-in">
              {recipe.title}
            </Card.Title>
            <Card.Img
              data-aos="fade-in"
              className={styles["img-responsive"]}
              variant="bottom"
              src={`http://localhost:5000/images/${recipe.mainImageUrl}`}
            />
            <OverviewDetails
              category={recipe.categories.label}
              prepTimeMins={recipe.prepTimeMins}
            />
            <ShareLinks title={recipe.title} />
            <Row className="my-5 w-100" data-aos="fade-up">
              <Col md={4}>
                {recipe.ingredientsByTitle && (
                  <RecipeIngredients
                    ingredientsByTitle={recipe.ingredientsByTitle}
                  />
                )}
              </Col>
              <Col md={8}>
                {recipe.instructions && (
                  <RecipeInstructions instructions={recipe.instructions} />
                )}
              </Col>
            </Row>
          </section>
          <CommentSection comments={recipe.comments} />
        </Container>
      )}
    </>
  )
}

export default SingleRecipePage
