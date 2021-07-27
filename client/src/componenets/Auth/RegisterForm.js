import React, { useState, useContext } from "react"
import AuthContext from "../../store/AuthCtx/auth-context"
import ModalContext from "../../store/ModalCtx/modal-context"
import { Form, Button, Row, Col } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  HEBREW_ENGLISH_TEXT_REGEX,
} from "../../utills/js/constants"
import FormErrorMessages from "./FormErrorMessages"
import Loader from "../Loader/Loader"
import Message from "../Message/Message"

const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(false)
  const { handleModalContent } = useContext(ModalContext)

  const { handleRegister } = useContext(AuthContext)

  const handleFormSubmit = ({ email, password, firstName, lastName }) => {
    setMessage(false)

    const newUser = {
      firstName,
      lastName,
      email,
      password,
    }
    setLoading(true)

    setTimeout(async () => {
      const { error, loading, success, userInfo, message } =
        await handleRegister(newUser)

      if (error) {
        setMessage({ variant: "danger", text: message })
      }

      if (success) {
        setMessage({ variant: "success", text: message })
      }

      setLoading(loading)
    }, 1000)
  }

  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("חובה*")
          .email("אימייל לא תקין")
          .matches(EMAIL_REGEX, "אימייל לא תקין"),
        firstName: Yup.string()
          .required("חובה*")
          .min(2, "מינימום 2 תווים")
          .max(20, "מקסימום 20 תווים")
          .matches(HEBREW_ENGLISH_TEXT_REGEX, "אותיות בלבד אנגלית או עברית"),
        lastName: Yup.string()
          .required("חובה*")
          .min(2, "מינימום 2 תווים")
          .max(20, "מקסימום 20 תווים")
          .matches(HEBREW_ENGLISH_TEXT_REGEX, "אותיות בלבד אנגלית או עברית"),
        password: Yup.string()
          .required("חובה*")
          .matches(
            PASSWORD_REGEX,
            "חובה ספרה, אות קטנה ואות גדולה (באנגלית) - לפחות 8 תווים"
          ),
        confirmPassword: Yup.string()
          .required("חובה*")
          .oneOf([Yup.ref("password"), null], "סיסמאות לא תואמות"),
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
              className=""
              id="email"
              name="email"
              type="email"
              placeholder="מייל"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <FormErrorMessages error={formik.errors.email} />
            )}
          </Form.Group>
          <Form.Group className="w-75">
            <Form.Control
              type="text"
              placeholder="שם פרטי"
              id="firstName"
              name="firstName"
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <FormErrorMessages error={formik.errors.firstName} />
            )}
          </Form.Group>
          <Form.Group className="w-75">
            <Form.Control
              type="text"
              name="lastName"
              id="lastName"
              placeholder="שם משפחה"
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <FormErrorMessages error={formik.errors.lastName} />
            )}
          </Form.Group>

          <Form.Group className="w-75">
            <Form.Control
              type="password"
              placeholder="סיסמא"
              name="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <FormErrorMessages error={formik.errors.password} />
            )}
          </Form.Group>

          <Form.Group className="w-75">
            <Form.Control
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="אימות סיסמא"
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <FormErrorMessages error={formik.errors.confirmPassword} />
              )}
          </Form.Group>

          <Button variant="dark" type="submit" className="w-75">
            הרשמה
          </Button>
          <Row className="text-center my-3">
            <Col className="d-flex align-items-center justify-content-center">
              <Button
                variant="link"
                className="p-0"
                onClick={() => handleModalContent("login")}
              >
                התחבר
              </Button>
              <span> ? יש לך משתמש </span>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
