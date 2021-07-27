import React, { useState, useEffect, useContext, useCallback } from "react"
import { useHistory, useLocation, Prompt } from "react-router-dom"
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
  filterMultipleObjectsByValue,
  findIngredientDeletedByUser,
} from "../../utills/js/functions"
import CustomBtn from "../../componenets/UI/CustomBtn"

const EditRecipeIngredientsPage = () => {
  const [isEnteringData, setIsEnteringData] = useState(false)
  const [ingredients, setIngredients] = useState(null)
  const [measureUnits, setMeasureUnits] = useState(null)
  const [updatedRecipeIngredients, setUpdatedRecipeIngredients] = useState([])
  const [recipeIngredientsToShow, setRecipeIngredientsToShow] = useState([])

  const { handleAddRecipeIngredients } = useContext(NewRecipeContext)

  const history = useHistory()

  const location = useLocation()

  const recipe = location?.state?.recipe

  const ingredientsByTitle = recipe?.ingredientsByTitle || []

  const arrangeIngredientsData = useCallback((ingredientsByTitle) => {
    const oldIngredients = []
    for (const { title, ingredients } of ingredientsByTitle) {
      for (const {
        amount,
        note,
        measureUnit,
        ingredient,
        recipeIngredientId,
      } of ingredients) {
        oldIngredients.push({
          recipeIngredientId,
          title,
          note,
          qty: amount,
          measureUnit,
          ingredient,
        })
      }
    }
    return oldIngredients
  }, [])

  const handleFormFocus = () => {
    setIsEnteringData(true)
  }

  const handleFinishEntering = () => {
    setIsEnteringData(false)
  }

  const handleAddingNewIngredient = (newIngredient) => {
    setRecipeIngredientsToShow((prevRecipeIngredients) => [
      ...prevRecipeIngredients,
      newIngredient,
    ])

    newIngredient.action = "INSERT"
    setUpdatedRecipeIngredients((prevUpdatedRecipeIngredients) => [
      ...prevUpdatedRecipeIngredients,
      newIngredient,
    ])

    const { value } = newIngredient.ingredient
    const filteredIngredients = filterChoosenIngredient(ingredients, value)
    setIngredients(filteredIngredients)
  }

  const handleDeleteNewIngredient = (deleteValue) => {
    if (window.confirm(`האם אתה בטוח ?`)) {
      const ingredientToDelete = findIngredientDeletedByUser(
        updatedRecipeIngredients,
        deleteValue
      )

      ingredientToDelete.action = "DELETE"

      const { ingredient } = ingredientToDelete

      const filteredNewIngredients = recipeIngredientsToShow.filter(
        ({ ingredient }) => ingredient.value !== deleteValue
      )
      setRecipeIngredientsToShow(filteredNewIngredients)
      setIngredients((prevIngredients) => [...prevIngredients, ingredient])
    }
  }

  const handleFormSubmit = () => {
    handleAddRecipeIngredients(updatedRecipeIngredients)
    history.push({
      pathname: "/recipes/edit/instructions",
      state: { recipe },
    })
  }

  const fetchData = async (oldIngredients) => {
    const ingredients = await getAllIngredients()
    const measureUnits = await getAllMeasureUnits()
    setMeasureUnits(measureUnits)
    const ingredientsWithoutOldIngredients = filterMultipleObjectsByValue(
      ingredients,
      oldIngredients
    )
    setIngredients(ingredientsWithoutOldIngredients)
  }

  useEffect(() => {
    if (!location.state) {
      history.push("/")
    }
  }, [])

  useEffect(() => {
    const oldIngredients = arrangeIngredientsData(ingredientsByTitle)
    setUpdatedRecipeIngredients(oldIngredients)
    setRecipeIngredientsToShow(oldIngredients)

    fetchData(oldIngredients)
  }, [])

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (!storedUserInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
    }

    if (updatedRecipeIngredients.length === 0) {
      handleFormFocus()
    }

    if (updatedRecipeIngredients.length > 0) {
      handleFinishEntering()
    }
  }, [history, ingredientsByTitle, updatedRecipeIngredients.length])

  return (
    <Formik
      initialValues={{
        qty: "",
        measureUnit: {},
        ingredient: {},
        title: "",
        note: "",
      }}
      validationSchema={Yup.object().shape({
        qty: Yup.number("מספרים בלבד")
          .required("*חובה")
          .positive("מספר חיובי")
          .typeError("you must specify a number"),
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
        handleAddingNewIngredient(values)
        setSubmitting(false)
        resetForm()
      }}
    >
      {(formik) => (
        <>
          <Container className="my-5">
            <NewRecipeSteps step1 step2 path="edit" />
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
                      options={ingredients}
                      placeholder="*רכיבים"
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
                <Col className="text-center my-2">
                  <CustomBtn
                    type="submit"
                    text="
                     הוסף רכיב +
                    "
                  />
                </Col>
              </Row>
            </Form>

            <NewIngredientsList
              newRecipeIngredients={recipeIngredientsToShow}
              handleDeleteNewIngredient={handleDeleteNewIngredient}
            />

            <Row>
              <Col className="text-center my-3">
                <CustomBtn
                  disabled={recipeIngredientsToShow.length < 2}
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

export default EditRecipeIngredientsPage
