import React, { useState, useEffect, useContext } from "react"
import { useHistory, Prompt } from "react-router-dom"
import AddRecipeFormInput from "../../componenets/Recipes/AddRecipeForm/AddRecipeFormInput"
import { Formik } from "formik"
import * as Yup from "yup"
import CustomSelect from "../../componenets/CustomSelect/CustomSelect"
import { Container, Form, Row, Col, Button } from "react-bootstrap"
import FormErrorMessages from "../../componenets/Auth/FormErrorMessages"
import NewRecipeContext from "../../store/NewRecipeCtx/new-recipe-context"
import NewRecipeSteps from "../../componenets/Recipes/NewRecipeSteps/NewRecipeSteps"
import NewIngredientsList from "../../componenets/Recipes/AddRecipeForm/NewIngredientsList"
import { getAllIngredients, getAllMeasureUnits } from "../../DAL/api"
import {
  filterChoosenIngredient,
  findIngredientDeletedByUser,
} from "../../utills/js/functions"
import CustomBtn from "../../componenets/UI/CustomBtn"

const NewRecipeIngredientsPage = () => {
  const [isEnteringData, setIsEnteringData] = useState(false)
  const [ingredients, setIngredients] = useState(null)
  const [measureUnits, setMeasureUnits] = useState(null)
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([])
  const [isEditingIngredient, setIsEditingIngredient] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editQty, setEditQty] = useState("")
  const [editIngredient, setEditIngredient] = useState(null)
  const [editMeasureUnit, setEditMeasureUnit] = useState(null)
  const [editNote, setEditNote] = useState("")
  const [editIdx, setEditIdx] = useState()

  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { handleAddRecipeIngredients, recipeIngredients } =
    useContext(NewRecipeContext)

  const history = useHistory()

  const handleFormFocus = () => {
    setIsEnteringData(true)
  }

  const handleFinishEntering = () => {
    setIsEnteringData(false)
  }

  const handleAddingNewIngredient = (newIngredient) => {
    setNewRecipeIngredients((prevNewRecipeIngredients) => [
      ...prevNewRecipeIngredients,
      newIngredient,
    ])

    const { value } = newIngredient.ingredient
    const filteredIngredients = filterChoosenIngredient(ingredients, value)
    setIngredients(filteredIngredients)
  }

  const handleDeleteNewIngredient = (deleteValue) => {
    if (window.confirm(`האם אתה בטוח ?`)) {
      const { ingredient } = findIngredientDeletedByUser(
        newRecipeIngredients,
        deleteValue
      )

      const filteredNewIngredients = newRecipeIngredients.filter(
        ({ ingredient }) => ingredient.value !== deleteValue
      )
      setNewRecipeIngredients(filteredNewIngredients)
      setIngredients((prevIngredients) => [...prevIngredients, ingredient])
    }
  }

  const handleShowEditIngredientData = (ingredientData, idx) => {
    const { ingredient, measureUnit, qty, note, title } = ingredientData
    setIsEditingIngredient(true)
    setEditIngredient(ingredient)
    setEditMeasureUnit(measureUnit)
    setEditNote(note)
    setEditQty(qty)
    setEditTitle(title)
    setEditIdx(idx)
  }

  const handleEditingIngredient = (editedIngredientData) => {
    let stateCopy = [...newRecipeIngredients]
    stateCopy[editIdx] = editedIngredientData
    setNewRecipeIngredients(stateCopy)
    setIsEditingIngredient(false)
    setEditIngredient(null)
    setEditMeasureUnit(null)
    setEditNote("")
    setEditQty("")
    setEditTitle("")
    setEditIdx()
  }

  const handleFormSubmit = () => {
    handleAddRecipeIngredients(newRecipeIngredients)
    history.push("/recipes/new/instructions")
  }

  const fetchData = async () => {
    const ingredients = await getAllIngredients()
    const measureUnits = await getAllMeasureUnits()
    setIngredients(ingredients)
    setMeasureUnits(measureUnits)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!storedUserInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
    }

    if (newRecipeIngredients.length === 0) {
      handleFormFocus()
    }

    if (newRecipeIngredients.length > 0) {
      handleFinishEntering()
    }
  }, [newRecipeIngredients, history])

  return (
    <Formik
      initialValues={{
        qty: editQty || "",
        measureUnit: editMeasureUnit || {},
        ingredient: editIngredient || {},
        title: editTitle || "",
        note: editNote || "",
      }}
      enableReinitialize
      validationSchema={Yup.object().shape({
        qty: Yup.number("מספרים בלבד").required("*חובה").positive("מספר חיובי"),
        measureUnit: Yup.object()
          .required("*חובה")
          .test(
            "OBJECT_KEYS",
            "חובה*",
            (selectedMeasureUnit) =>
              selectedMeasureUnit.value && selectedMeasureUnit.label
          ),
        ingredient: Yup.object()
          .required("*חובה")
          .test(
            "OBJECT_KEYS",
            "חובה*",
            (selectedIngredient) =>
              selectedIngredient.value && selectedIngredient.label
          ),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (isEditingIngredient) {
          handleEditingIngredient(values)
          setSubmitting(false)
          resetForm()
        } else {
          handleAddingNewIngredient(values)
          setSubmitting(false)
          resetForm()
        }
      }}
    >
      {(formik) => (
        <>
          <Container className="my-5">
            <NewRecipeSteps step1 step2 />
            <Prompt
              when={isEnteringData}
              message={() => "המתכון שלך לא יישמר, האם אתה בטוח ?"}
            />
            <Form onFocus={handleFormFocus} onSubmit={formik.handleSubmit}>
              <Row>
                <Col lg={4}>
                  <AddRecipeFormInput
                    formik={formik}
                    placeholder="*כמות"
                    name="qty"
                    id="qty"
                    type="number"
                  />
                </Col>
                <Col lg={4}>
                  <Form.Group>
                    <CustomSelect
                      options={measureUnits}
                      placeholder="*יחידות מידה"
                      value={formik.values.measureUnit}
                      onChange={(selectedMeasureUnit) =>
                        formik.setFieldValue("measureUnit", selectedMeasureUnit)
                      }
                    />
                    {formik.touched.measureUnit &&
                      formik.errors.measureUnit && (
                        <FormErrorMessages error={formik.errors.measureUnit} />
                      )}
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group>
                    <CustomSelect
                      placeholder="*רכיבים"
                      options={ingredients}
                      value={formik.values.ingredient}
                      onChange={(selectedIngredient) =>
                        formik.setFieldValue("ingredient", selectedIngredient)
                      }
                    />
                    {formik.touched.ingredient && formik.errors.ingredient && (
                      <FormErrorMessages error={formik.errors.ingredient} />
                    )}
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <AddRecipeFormInput
                    formik={formik}
                    placeholder="כותרת למשל: לבשר, לרוטב וכ'ו"
                    name="title"
                    id="title"
                    type="text"
                  />
                </Col>
                <Col lg={6}>
                  <AddRecipeFormInput
                    formik={formik}
                    placeholder="קצוץ, חתוך לקוביות וכ'ו"
                    name="note"
                    id="note"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center my-2">
                  <CustomBtn
                    type="submit"
                    text={
                      editQty && editIngredient && editMeasureUnit
                        ? "עדכן מרכיב"
                        : "הוסף מרכיב +"
                    }
                  />
                </Col>
              </Row>
            </Form>

            <NewIngredientsList
              newRecipeIngredients={newRecipeIngredients}
              handleDeleteNewIngredient={handleDeleteNewIngredient}
              handleEditNewIngredient={handleShowEditIngredientData}
            />

            <Row>
              <Col className="text-center my-3">
                <CustomBtn
                  disabled={newRecipeIngredients.length < 2}
                  className="w-25"
                  text="להוראות ההכנה"
                  onClick={handleFormSubmit}
                />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </Formik>
  )
}

export default NewRecipeIngredientsPage
