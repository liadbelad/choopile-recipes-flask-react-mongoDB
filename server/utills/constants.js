const HEBREW_ENGLISH_SPACE_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe ]+$/i
const HEBREW_ENGLISH_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe]+$/i
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
const FILE_SIZE = 3000000
const SUPPORTED_FILE_FORMATS = ["image/jpg", "image/jpeg", "image/png"]
const COOKIE_TIME_24_HOURS = 8.64e7
const PAGES_LIMIT = 6
// password regex Description
// ^	The password string will start this way
// (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
// (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
// (?=.*[0-9])	The string must contain at least 1 numeric character
// (?=.*[!@#$%^&*])	The string must contain at least one special character,
// but we are escaping reserved RegEx characters to avoid conflict
// (?=.{8,})	The string must be eight characters or longer

module.exports = {
  EMAIL_REGEX,
  HEBREW_ENGLISH_TEXT_REGEX,
  HEBREW_ENGLISH_SPACE_TEXT_REGEX,
  PASSWORD_REGEX,
  SUPPORTED_FILE_FORMATS,
  FILE_SIZE,
  COOKIE_TIME_24_HOURS,
  PAGES_LIMIT,
}
