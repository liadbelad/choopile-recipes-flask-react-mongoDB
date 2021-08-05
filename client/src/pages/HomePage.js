import React, { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import useHttp from "../hooks/use-http"
import Header from "../componenets/Header/Header"
import RecipesList from "../componenets/Recipes/RecipesList/RecipesList"
import Menu from "../componenets/Menu/Menu"
import Loader from "../componenets/Loader/Loader"
import Message from "../componenets/Message/Message"
import NoRecipesFound from "../componenets/Recipes/NoRecipesFound/NoRecipesFound"
import ModalContext from "../store/ModalCtx/modal-context"
import { getNewestRecipes } from "../DAL/recipesApi"

const HomePage = () => {
  const [newestRecipes, setNewestRecipes] = useState([])
  const [activePageNumber, setActivePageNumber] = useState(1)
  const [isLoadingMoreRecipes, setIsLoadingMoreRecipes] = useState(false)

  const location = useLocation()
  const { handleOpenModal } = useContext(ModalContext)

  const {
    sendRequest,
    status,
    data: loadedRecipes,
    error,
  } = useHttp(getNewestRecipes, true)

  const handleScroll = async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight

    if (bottom) {
      setActivePageNumber((prevPageNumber) => prevPageNumber + 1)
    }
  }

  const getNextNewestRecipes = async () => {
    setIsLoadingMoreRecipes(true)
    const nextPageRecipes = await getNewestRecipes(activePageNumber)
    setNewestRecipes((prevRecipes) => [...prevRecipes, ...nextPageRecipes])
    setIsLoadingMoreRecipes(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (location?.state?.isRedirect) {
      handleOpenModal()
    }
    sendRequest()
  }, [sendRequest])

  const loadedRecipesLength = loadedRecipes?.length
  const newestRecipesLength = newestRecipes.length

  useEffect(() => {
    if (loadedRecipesLength > 0 && newestRecipesLength === 0) {
      setNewestRecipes(loadedRecipes)
    }
  }, [loadedRecipes, newestRecipesLength, loadedRecipesLength])

  useEffect(() => {
    if (activePageNumber > 1) {
      getNextNewestRecipes(activePageNumber)
    }
  }, [activePageNumber])

  return (
    <>
      <Menu />
      <Header />

      {error && <Message> {error} </Message>}
      {status === "completed" &&
        (!loadedRecipes || loadedRecipes.length === 0) && <NoRecipesFound />}

      {newestRecipesLength > 0 && (
        <span id="newestRecipesGallery">
          <RecipesList className="flex-container" recipes={newestRecipes} />
        </span>
      )}
      {isLoadingMoreRecipes && (
        <div className="d-flex justify-content-center">
          <Loader />
        </div>
      )}
    </>
  )
}

export default HomePage
