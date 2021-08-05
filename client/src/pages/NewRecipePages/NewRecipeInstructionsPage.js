import React, { useState, useEffect, useContext } from "react"
import { useHistory, Prompt } from "react-router-dom"
import { Formik } from "formik"
import * as Yup from "yup"
import { Container, Form, Row, Col, Button } from "react-bootstrap"
import AuthContext from "../../store/AuthCtx/auth-context"
import AddRecipeFormInput from "../../componenets/Recipes/AddRecipeForm/AddRecipeFormInput"
import NewRecipeContext from "../../store/NewRecipeCtx/new-recipe-context"
import NewRecipeSteps from "../../componenets/Recipes/NewRecipeSteps/NewRecipeSteps"
import NewInstructionsList from "../../componenets/Recipes/AddRecipeForm/NewInstructionsList"
import CustomBtn from "../../componenets/UI/CustomBtn"

const NewRecipeInstructionsPage = () => {
  const [isEnteringData, setIsEnteringData] = useState(false)
  const [newRecipeInstructions, setNewRecipeInstructions] = useState([])
  const [isEditingInstruction, setIsEditingInstruction] = useState(false)
  const [editInstruction, setEditInstruction] = useState("")
  const [editIdx, setEditIdx] = useState()

  const { isLoggedIn } = useContext(AuthContext)

  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { handleAddRecipeInstructions, handleAddNewRecipe } =
    useContext(NewRecipeContext)

  const history = useHistory()

  const handleFormFocus = () => {
    setIsEnteringData(true)
  }

  const handleFinishEntering = () => {
    setIsEnteringData(false)
  }

  const handleAddingNewInstruction = (newInstruction) => {
    setNewRecipeInstructions((prevNewRecipeInstructions) => [
      ...prevNewRecipeInstructions,
      newInstruction,
    ])
  }

  const handleDeleteNewInstruction = (deleteIdx) => {
    if (window.confirm(`האם אתה בטוח ?`)) {
      const filteredNewInstructions = newRecipeInstructions.filter(
        (Instruction, idx) => idx !== deleteIdx
      )
      setNewRecipeInstructions(filteredNewInstructions)
    }
  }

  const handleShowEditInstruction = (instructionData, idx) => {
    const { instruction } = instructionData
    setIsEditingInstruction(true)
    setEditInstruction(instruction)
    setEditIdx(idx)
  }

  const handleEditingInstruction = (editedInstructionData) => {
    let stateCopy = [...newRecipeInstructions]
    stateCopy[editIdx] = editedInstructionData
    setNewRecipeInstructions(stateCopy)
    setIsEditingInstruction(false)
    setEditInstruction("")
    setEditIdx()
  }

  const handleFormSubmit = async () => {
    handleAddRecipeInstructions(newRecipeInstructions, storedUserInfo.id)
    const { recipeId, error } = await handleAddNewRecipe()
    if (!recipeId && error) {
      history.replace("/recipes/new/error")
      return
    }

    history.push({ pathname: "/recipes/new/success", state: { recipeId } })
  }

  useEffect(() => {
    if (!storedUserInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
    }

    if (newRecipeInstructions.length === 0) {
      handleFormFocus()
    }

    if (newRecipeInstructions.length > 0) {
      handleFinishEntering()
    }
  }, [history])

  return (
    <Formik
      initialValues={{
        instruction: editInstruction || "",
      }}
      enableReinitialize
      validationSchema={Yup.object().shape({
        instruction: Yup.string().required("*חובה"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (isEditingInstruction) {
          handleEditingInstruction(values)
          setSubmitting(false)
          resetForm()
        } else {
          handleAddingNewInstruction(values)
          setSubmitting(false)
          resetForm()
        }
      }}
    >
      {(formik) => (
        <Container className="my-5">
          <NewRecipeSteps step1 step2 step3 />
          <Prompt
            when={isEnteringData}
            message={() => "המתכון שלך לא יישמר, האם אתה בטוח ?"}
          />
          <Form onFocus={handleFormFocus} onSubmit={formik.handleSubmit}>
            <Row className="d-flex justify-content-center text-center">
              <AddRecipeFormInput
                as="textarea"
                rows={2}
                formik={formik}
                placeholder="*מה יבוצע בשלב הזה?"
                name="instruction"
                id="instruction"
                type="text"
                width="w-50"
              />

              <Form.Group className="mt-2 mr-2">
                <CustomBtn
                  type="submit"
                  text={
                    isEditingInstruction && editInstruction ? "עדכן" : "הוסף +"
                  }
                />
              </Form.Group>
            </Row>
          </Form>

          <NewInstructionsList
            newRecipeInstructions={newRecipeInstructions}
            handleDeleteNewInstruction={handleDeleteNewInstruction}
            handleEditNewInstruction={handleShowEditInstruction}
          />

          <Row>
            <Col className="text-center my-3">
              <CustomBtn
                disabled={newRecipeInstructions.length < 2}
                className="w-25"
                text="הוסף מתכון"
                onClick={handleFormSubmit}
              />
            </Col>
          </Row>
        </Container>
      )}
    </Formik>
  )
}

export default NewRecipeInstructionsPage
