const Yup = require("yup")
const {
  HEBREW_ENGLISH_TEXT_REGEX,
  PASSWORD_REGEX,
} = require("../utills/constants")

const userLoginSchema = Yup.object({
  email: Yup.string().required("חובה*").email("אימייל לא תקין"),
  password: Yup.string()
    .required("חובה*")
    .matches(
      PASSWORD_REGEX,
      "חובה ספרה, אות קטנה ואות גדולה (באנגלית) - לפחות 8 תווים"
    ),
})

const userRegisterSchema = Yup.object({
  email: Yup.string().required("חובה*").email("אימייל לא תקין"),
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
})

module.exports = { userLoginSchema, userRegisterSchema }
