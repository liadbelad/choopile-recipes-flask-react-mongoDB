import React, { useState, useEffect, useContext } from "react"
import { useHistory, Prompt } from "react-router-dom"
import AddRecipeFormInput from "../../componenets/Recipes/AddRecipeForm/AddRecipeFormInput"
import { Formik } from "formik"
import * as Yup from "yup"
import CustomSelect from "../../componenets/CustomSelect/CustomSelect"
import { Container, Form, Row, Col, Button } from "react-bootstrap"
import FormErrorMessages from "../../componenets/Auth/FormErrorMessages"
import NewRecipeContext from "../../store/NewRecipeCtx/new-recipe-context"
import { getAllCategories } from "../../DAL/api"
import { SUPPORTED_FILE_FORMATS } from "../../utills/js/constants"
import NewRecipeSteps from "../../componenets/Recipes/NewRecipeSteps/NewRecipeSteps"
import CustomBtn from "../../componenets/UI/CustomBtn"
import styles from "./NewRecipeDetailsPage.module.scss"

const NewRecipeDetailsPage = () => {
  const [isEnteringData, setIsEnteringData] = useState(false)
  const [categories, setCategories] = useState(null)
  const [previewImage, setPreviewImage] = useState("")

  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { handleAddRecipeDetails, recipeDetails } = useContext(NewRecipeContext)

  const history = useHistory()

  const handleImageChange = (event, formik) => {
    formik.setFieldValue("imageFiles", event.target.files[0])
    if (event.target.files[0]) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]))
    }
  }

  const handleFormFocus = () => {
    setIsEnteringData(true)
  }

  const handleFinishEntering = () => {
    setIsEnteringData(false)
  }

  const handleFormSubmit = (newRecipeDetails) => {
    handleFinishEntering()
    handleAddRecipeDetails(newRecipeDetails)
    history.push("/recipes/new/ingredients")
  }

  const fetchCategories = async () => {
    const categories = await getAllCategories()
    setCategories(categories)
  }

  useEffect(() => {
    let mounted = true
    if (!storedUserInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
    }
    if (!categories) {
      fetchCategories()
    }

    return () => (mounted = false)
  }, [history, categories])

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        servings: "",
        prepTimeMins: "",
        imageFiles: "",
        categories: { value: null, label: null },
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .required("*חובה")
          .min(2, "מינימום 2 תווים")
          .max(60, "מקסימום 60 תווים"),

        description: Yup.string()
          .required("*חובה")
          .max(255, "מקסימום 255 תווים"),
        servings: Yup.number()
          .required("*חובה")
          .max(100, "מקסימום 100 מנות")
          .min(1, "מספר חיובי"),
        prepTimeMins: Yup.number()
          .required("*חובה")
          .max(1000, "מקסימום 1000 דקות")
          .min(1, "מספר חיובי"),
        imageFiles: Yup.mixed()
          .required("חובה*")
          .test(
            "FILE_FORMAT",
            "תמונות בלבד",
            (value) =>
              !value || (value && SUPPORTED_FILE_FORMATS.includes(value.type))
          )
          .test(
            "FILE_SIZE",
            "עד 1 מגה בייט",
            (value) => value && value.size <= 2e6
          ),
        categories: Yup.object()
          .required("חובה")
          .test(
            "OBJECT_KEYS",
            "חובה*",
            (selectedCategory) =>
              selectedCategory.label && selectedCategory.value
          ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleFormSubmit(values)
        setSubmitting(false)
      }}
    >
      {(formik) => (
        <Container className="my-5">
          <NewRecipeSteps step1 />
          <Prompt
            when={isEnteringData}
            message={() => "המתכון שלך לא יישמר, האם אתה בטוח ?"}
          />
          <Form onFocus={handleFormFocus} onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={8}>
                <AddRecipeFormInput
                  formik={formik}
                  placeholder="כותרת"
                  name="title"
                  id="title"
                  type="text"
                  title="כותרת המתכון*"
                />

                <AddRecipeFormInput
                  formik={formik}
                  as="textarea"
                  placeholder="כאן אתם יכולים להשוויץ במתכון ולעודד אנשים לצפות בו !"
                  name="description"
                  id="description"
                  type="text"
                  title="תיאור המתכון*"
                />
                <Form.Group>
                  <Form.Label className="font-weight-bold">קטגוריה*</Form.Label>
                  <CustomSelect
                    options={categories}
                    value={formik.values.categories}
                    onChange={(selectedCategory) => {
                      formik.setFieldValue("categories", selectedCategory)
                    }}
                    name="categories"
                  />
                  {formik.touched.categories && formik.errors.categories && (
                    <FormErrorMessages error={formik.errors.categories} />
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <label className={styles["custom-file-upload"]}>
                    <input
                      type="file"
                      name="imageFiles"
                      id="imageFiles"
                      accept="image/x-png,image/gif,image/jpeg"
                      onChange={(event) => handleImageChange(event, formik)}
                    />
                    <i className="fa fa-cloud-upload" /> בחר תמונה
                  </label>

                  {previewImage && !formik.errors.imageFiles && (
                    <img
                      className="mr-2"
                      src={previewImage}
                      width="200px"
                      height="130px"
                    />
                  )}
                  {previewImage && formik.errors.imageFiles && (
                    <FormErrorMessages error={formik.errors.imageFiles} />
                  )}
                </Form.Group>

                <AddRecipeFormInput
                  formik={formik}
                  name="servings"
                  id="servings"
                  type="number"
                  title="כמות מנות*"
                />

                <AddRecipeFormInput
                  formik={formik}
                  name="prepTimeMins"
                  id="prepTimeMins"
                  type="number"
                  title="זמן הכנה (בדקות)*"
                />
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <CustomBtn type="submit" className="w-25" text="לשלב הבא" />
              </Col>
            </Row>
          </Form>
        </Container>
      )}
    </Formik>
  )
}

export default NewRecipeDetailsPage
