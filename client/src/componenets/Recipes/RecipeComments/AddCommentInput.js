import React from "react"
import { useParams } from "react-router-dom"
import { Formik } from "formik"
import * as Yup from "yup"
import { Form, Button } from "react-bootstrap"
import AddRecipeFormInput from "../AddRecipeForm/AddRecipeFormInput"
import useHttp from "../../../hooks/use-http"
import styles from "./AddCommentInput.module.scss"
import { addRecipeCommentById } from "../../../DAL/recipesApi"
import Loader from "../../Loader/Loader"
import Message from "../../Message/Message"
import CustomBtn from "../../UI/CustomBtn"

const AddCommentInput = ({ handleShowNewCommentList }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { id: recipeID } = useParams()
  const { sendRequest, status, error, data } = useHttp(addRecipeCommentById)
  const handleFormSubmit = (content) => {
    sendRequest({ recipeID, content })
  }

  if (!userInfo) {
    return <Message> התחבר כדי להוסיף תגובה </Message>
  }

  if (status === "loading") return <Loader />

  if (status === "error") return <Message> {error} </Message>

  if (status === "completed" && data) {
    console.log(data.comments)
    handleShowNewCommentList(data.comments)
    return <Message variant="success"> {data.msg} </Message>
  }

  return (
    <Formik
      initialValues={{ comment: "" }}
      validationSchema={Yup.object({
        comment: Yup.string().required("*חובה"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        handleFormSubmit(values)
        setSubmitting(false)
        resetForm()
      }}
    >
      {(formik) => (
        <Form
          onSubmit={formik.handleSubmit}
          className={styles["add-comment-container"]}
        >
          <AddRecipeFormInput
            formik={formik}
            as="textarea"
            placeholder="הוסף תגובה"
            name="comment"
            id="comment"
            type="text"
            rows={2}
            width="w-100"
          />
          <CustomBtn className={styles["add-btn"]} text="שלח" type="submit" />
        </Form>
      )}
    </Formik>
  )
}

export default AddCommentInput
