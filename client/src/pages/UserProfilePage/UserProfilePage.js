import React, { useEffect, useState } from "react"
import { Form, Button } from "react-bootstrap"
import { Formik } from "formik"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  HEBREW_ENGLISH_TEXT_REGEX,
} from "../../utills/js/constants"
import FormErrorMessages from "../../componenets/Auth/FormErrorMessages"
import { getUserDetails, updateUserDetails } from "../../DAL/userApi"
import useHttp from "../../hooks/use-http"
import Loader from "../../componenets/Loader/Loader"
import Message from "../../componenets/Message/Message"
import { useContext } from "react"
import AuthContext from "../../store/AuthCtx/auth-context"

const UserProfilePage = () => {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))

  const { handleUserDetailsUpdate } = useContext(AuthContext)

  const {
    sendRequest: userDetailsRequest,
    status: getUserDetailsStatus,
    error: getUserDetailsError,
    data: userDetails,
  } = useHttp(getUserDetails, true)

  const history = useHistory()

  const handleFormSubmit = async (newUserDetails) => {
    const updatedUser = await updateUserDetails(newUserDetails)
    if (updatedUser.error) {
      setError(updatedUser.message)
      return
    }

    setError(null)
    handleUserDetailsUpdate(updatedUser[0].firstName)
    setSuccess("פרטייך נשמרו במערכת,מיד תעבור לעמוד הבית")

    setTimeout(() => {
      history.replace("/")
    }, 2000)
  }

  useEffect(() => {
    if (!storedUserInfo) {
      history.push({
        pathname: "/",
        state: { isRedirect: true },
      })
    }
  }, [storedUserInfo, history])

  useEffect(() => {
    userDetailsRequest()
  }, [userDetailsRequest])

  if (getUserDetailsStatus === "pending") return <Loader />

  return (
    <Formik
      initialValues={{
        email: userDetails?.email || "",
        firstName: userDetails?.firstName || "",
        lastName: userDetails?.lastName || "",
        password: "",
        newPassword: "",
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
        newPassword: Yup.string()
          .required("חובה*")
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
          className="text-center d-flex align-items-center flex-column my-4"
        >
          <h2> אזור אישי - עדכון פרטים </h2>
          <hr />

          {getUserDetailsError && <Message> {getUserDetailsError} </Message>}
          {error && <Message> {error} </Message>}
          {success && <Message variant="info"> {success} </Message>}

          <Form.Group className="w-75">
            <Form.Label className="font-weight-bold"> אימייל: </Form.Label>
            <Form.Control
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
            <Form.Label className="font-weight-bold"> שם פרטי: </Form.Label>
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
            <Form.Label className="font-weight-bold"> שם משפחה: </Form.Label>
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
            <Form.Label className="font-weight-bold"> סיסמא: </Form.Label>
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
            <Form.Label className="font-weight-bold"> סיסמא חדשה: </Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="סיסמא חדשה"
              {...formik.getFieldProps("newPassword")}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <FormErrorMessages error={formik.errors.newPassword} />
            )}
          </Form.Group>

          <Button variant="dark" type="submit" className="w-25">
            עדכון
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default UserProfilePage
