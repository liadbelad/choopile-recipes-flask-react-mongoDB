import React, { useState, useEffect, useContext } from "react"
import { useHistory, Prompt, useLocation } from "react-router-dom"
import { Formik } from "formik"
import * as Yup from "yup"
import { Container, Form, Row, Col, Button } from "react-bootstrap"
import AuthContext from "../../store/AuthCtx/auth-context"
import AddRecipeFormInput from "../../componenets/Recipes/AddRecipeForm/AddRecipeFormInput"
import NewRecipeContext from "../../store/NewRecipeCtx/new-recipe-context"
import NewRecipeSteps from "../../componenets/Recipes/NewRecipeSteps/NewRecipeSteps"
import NewInstructionsList from "../../componenets/Recipes/AddRecipeForm/NewInstructionsList"
import CustomBtn from "../../componenets/UI/CustomBtn"

const EditRecipeInstructionsPage = () => {
  const [isEnteringData, setIsEnteringData] = useState(false)
  const [updatedRecipeInstructions, setUpdatedRecipeInstructions] = useState([])
  const [recipeInstructionsToShow, setRecipeInstructionsToShow] = useState([])

  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { handleAddRecipeInstructions, handleUpdateRecipe } =
    useContext(NewRecipeContext)

  const history = useHistory()

  const location = useLocation()

  const oldInstructions = location?.state?.recipe?.instructions || []

  const recipe = location.state.recipe

  const handleFormFocus = () => {
    setIsEnteringData(true)
  }

  const handleFinishEntering = () => {
    setIsEnteringData(false)
  }

  const handleAddingNewInstruction = (newInstruction) => {
    setRecipeInstructionsToShow((prevRecipeInstructions) => [
      ...prevRecipeInstructions,
      newInstruction,
    ])
    newInstruction.action = "INSERT"
    setUpdatedRecipeInstructions((prevUpdatedRecipeInstructions) => [
      ...prevUpdatedRecipeInstructions,
      newInstruction,
    ])
  }

  const handleDeleteNewInstruction = (deleteIdx) => {
    if (window.confirm(`האם אתה בטוח ?`)) {
      const instructionToDelete = updatedRecipeInstructions.find(
        (Instruction, idx) => idx === deleteIdx
      )

      instructionToDelete.action = "DELETE"

      const filteredNewInstructions = recipeInstructionsToShow.filter(
        (Instruction, idx) => idx !== deleteIdx
      )
      setRecipeInstructionsToShow(filteredNewInstructions)
    }
  }

  const handleFormSubmit = () => {
    handleAddRecipeInstructions(updatedRecipeInstructions, storedUserInfo.id)
    handleUpdateRecipe(recipe.id)
    history.push({
      pathname: "/recipes/edit/success",
      state: { recipeId: recipe.id },
    })
  }

  useEffect(() => {
    if (!location.state) {
      history.push("/")
    }
  }, [])

  useEffect(() => {
    setUpdatedRecipeInstructions(oldInstructions)
    setRecipeInstructionsToShow(oldInstructions)
  }, [])

  useEffect(() => {
    if (!storedUserInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
    }

    if (updatedRecipeInstructions.length === 0) {
      handleFormFocus()
    }

    if (updatedRecipeInstructions.length > 0) {
      handleFinishEntering()
    }
  }, [updatedRecipeInstructions])

  return (
    <Formik
      initialValues={{
        instruction: "",
      }}
      validationSchema={Yup.object().shape({
        instruction: Yup.string().required("*חובה"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        handleAddingNewInstruction(values)
        setSubmitting(false)
        resetForm()
      }}
    >
      {(formik) => (
        <Container className="my-5">
          <NewRecipeSteps step1 step2 step3 path="edit" />
          <Prompt
            when={isEnteringData}
            message={() => "המתכון שלך לא יישמר, האם אתה בטוח ?"}
          />
          <Form onFocus={handleFormFocus} onSubmit={formik.handleSubmit}>
            <Row className="d-flex justify-content-center text-center">
              <AddRecipeFormInput
                formik={formik}
                as={"textarea"}
                rows={2}
                placeholder="*מה יבוצע בשלב הזה?"
                name="instruction"
                id="instruction"
                type="text"
                width="w-50"
              />

              <Form.Group className="mt-2 mr-2">
                <CustomBtn type="submit" text="הוסף +" />
              </Form.Group>
            </Row>
          </Form>

          <NewInstructionsList
            newRecipeInstructions={recipeInstructionsToShow}
            handleDeleteNewInstruction={handleDeleteNewInstruction}
          />

          <Row>
            <Col className="text-center my-3">
              <CustomBtn
                disabled={recipeInstructionsToShow.length < 2}
                className="w-25"
                text="                עדכון מתכון
                "
                onClick={handleFormSubmit}
              />
            </Col>
          </Row>
        </Container>
      )}
    </Formik>
  )
}

export default EditRecipeInstructionsPage
