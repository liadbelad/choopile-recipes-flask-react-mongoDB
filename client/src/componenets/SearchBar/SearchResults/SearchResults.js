import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getRecipesBySearchTerm } from "../../../DAL/recipesApi"
import Col from "react-bootstrap/Col"
import Loader from "../../Loader/Loader"
import Message from "../../Message/Message"

const SearchResults = ({ md, lg, enteredKeyword }) => {
  const [searchRecipesResults, setSearchRecipesResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFinishedSearch, setIsFinishedSearch] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (enteredKeyword.length === 0) {
      setSearchRecipesResults([])
      return
    }

    setIsFinishedSearch(false)
    const debounceTimer = setTimeout(async () => {
      setIsLoading(true)
      const recipes = await getRecipesBySearchTerm(enteredKeyword)
      setSearchRecipesResults(recipes)
      setIsFinishedSearch(true)

      setIsLoading(false)
    }, 800)

    return () => {
      clearInterval(debounceTimer)
    }
  }, [enteredKeyword])

  return (
    <Col
      className="mx-auto"
      style={{
        zIndex: "5",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      {isLoading && <Loader />}
      {error && <Message> {error} </Message>}
      {searchRecipesResults.length === 0 &&
        enteredKeyword &&
        isFinishedSearch && <p> אין תוצאות </p>}
      {searchRecipesResults &&
        searchRecipesResults.map((recipe) => (
          <p key={recipe.id}>
            <Link className="my-1 text-dark" to={`/recipes/${recipe.id}`}>
              {recipe.title}
            </Link>
          </p>
        ))}
    </Col>
  )
}

export default SearchResults
