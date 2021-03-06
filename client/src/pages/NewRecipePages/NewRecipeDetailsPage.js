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
          .required("*????????")
          .min(2, "?????????????? 2 ??????????")
          .max(60, "?????????????? 60 ??????????"),

        description: Yup.string()
          .required("*????????")
          .max(255, "?????????????? 255 ??????????"),
        servings: Yup.number()
          .required("*????????")
          .max(100, "?????????????? 100 ????????")
          .min(1, "???????? ??????????"),
        prepTimeMins: Yup.number()
          .required("*????????")
          .max(1000, "?????????????? 1000 ????????")
          .min(1, "???????? ??????????"),
        imageFiles: Yup.mixed()
          .required("????????*")
          .test(
            "FILE_FORMAT",
            "???????????? ????????",
            (value) =>
              !value || (value && SUPPORTED_FILE_FORMATS.includes(value.type))
          )
          .test(
            "FILE_SIZE",
            "???? 1 ?????? ????????",
            (value) => value && value.size <= 2e6
          ),
        categories: Yup.object()
          .required("????????")
          .test(
            "OBJECT_KEYS",
            "????????*",
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
            message={() => "???????????? ?????? ???? ??????????, ?????? ?????? ???????? ?"}
          />
          <Form onFocus={handleFormFocus} onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={8}>
                <AddRecipeFormInput
                  formik={formik}
                  placeholder="??????????"
                  name="title"
                  id="title"
                  type="text"
                  title="?????????? ????????????*"
                />

                <AddRecipeFormInput
                  formik={formik}
                  as="textarea"
                  placeholder="?????? ?????? ???????????? ?????????????? ???????????? ???????????? ?????????? ?????????? ???? !"
                  name="description"
                  id="description"
                  type="text"
                  title="?????????? ????????????*"
                />
                <Form.Group>
                  <Form.Label className="font-weight-bold">??????????????*</Form.Label>
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
                    <i className="fa fa-cloud-upload" /> ?????? ??????????
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
                  title="???????? ????????*"
                />

                <AddRecipeFormInput
                  formik={formik}
                  name="prepTimeMins"
                  id="prepTimeMins"
                  type="number"
                  title="?????? ???????? (??????????)*"
                />
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <CustomBtn type="submit" className="w-25" text="???????? ??????" />
              </Col>
            </Row>
          </Form>
        </Container>
      )}
    </Formik>
  )
}

export default NewRecipeDetailsPage
