import React, { useState, useContext } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import AuthContext from "../../store/AuthCtx/auth-context"
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../utills/js/constants"
import FormErrorMessages from "./FormErrorMessages"
import Loader from "../Loader/Loader"
import Message from "../Message/Message"
import ModalContext from "../../store/ModalCtx/modal-context"

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(false)

  const { handleLogin } = useContext(AuthContext)

  const { handleModalContent, handleCloseModal } = useContext(ModalContext)

  const handleFormSubmit = async (loginUser) => {
    setMessage(false)
    setLoading(true)
    setTimeout(async () => {
      const { userInfo, error, success, loading, message } = await handleLogin(
        loginUser
      )

      if (error) {
        setMessage({ variant: "danger", text: message })
      }

      if (success) {
        setMessage({ variant: "success", text: message })
        setTimeout(() => {
          handleCloseModal()
        }, 500)
      }

      setLoading(loading)
    }, 1000)
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("*חובה")
          .matches(EMAIL_REGEX, "אימייל לא תקין"),
        password: Yup.string()
          .required("*חובה")
          .matches(
            PASSWORD_REGEX,
            "חובה ספרה, אות קטנה ואות גדולה (באנגלית) - לפחות 8 תווים"
          ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleFormSubmit(values)
        setSubmitting(false)
      }}
    >
      {(formik) => (
        <Form
          onSubmit={formik.handleSubmit}
          className="text-center d-flex align-items-center flex-column"
        >
          {loading && <Loader />}
          {message && (
            <Message variant={message.variant}> {message.text} </Message>
          )}
          <Form.Group className="w-75">
            <Form.Control
              id="email"
              type="email"
              name="email"
              placeholder="מייל"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <FormErrorMessages error={formik.errors.email} />
            )}
          </Form.Group>

          <Form.Group className="w-75">
            <Form.Control
              id="password"
              type="password"
              name="password"
              placeholder="סיסמא"
              {...formik.getFieldProps("password")}
            />

            {formik.touched.password && formik.errors.password && (
              <FormErrorMessages error={formik.errors.password} />
            )}
          </Form.Group>

          <Button variant="dark" type="submit" className="w-75">
            התחבר
          </Button>

          <Row className="text-center my-3">
            <Col className="d-flex align-items-center justify-content-center">
              <Button
                variant="link"
                className="p-0"
                onClick={() => handleModalContent("register")}
              >
                הרשם
              </Button>
              <span> ? אין לך עדיין משתמש </span>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
