const {
  loginUserQuery,
  registerUserQuery,
  userExistQuery,
} = require("../DAL/api")
const bcrypt = require("bcryptjs")
const generateToken = require("../utills/generateToken")
const { isUserExistQuery, updateUserDetailsQuery } = require("../DAL/userApi")

// @desc    register new user
// @route   POST /api/users
// @access  Public
const register = async (req, res) => {
  const { firstName, email, password, lastName } = req.body

  try {
    const userExist = await userExistQuery(email)

    if (userExist[0]) {
      throw new Error("משתמש קיים,התחבר")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await registerUserQuery(
      firstName,
      lastName,
      hashedPassword,
      email
    )

    if (!createdUser) {
      throw new Error("שגיאה ביצירת משתמש,נסה שוב מאוחר יותר")
    }

    const token = generateToken(createdUser.id)
    console.log(token)

    res.status(201).json({ createdUser, token })
  } catch (error) {
    res.status(400).json({ error: true, message: error.message })
  }
}

// @desc    login user
// @route   POST /api/users
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await loginUserQuery(email)
    if (!user[0]) {
      throw new Error("אימייל או סיסמא לא נכונים")
    }
    if (!user[0].isVerified) {
      throw new Error("משתמש לא מאושר,אישור מחכה באימייל")
    }
    const isSamePassword = await bcrypt.compare(password, user[0].password)

    if (!isSamePassword) {
      throw new Error("אימייל או סיסמא לא נכונים")
    }
    const expiryDate = new Date(Number(new Date()) + 315360000000)

    res.cookie("userId", user[0].id, {
      expires: expiryDate,
      httpOnly: true,
    })

    console.log(res.cookie.userId)

    const token = generateToken(user.id)

    res.status(200).json(user[0])
  } catch (error) {
    return res.status(401).json({ error: true, message: error.message })
  }
}

// @desc    update user details
// @route   PUT /api/users
// @access  Public
const updateUserDetails = async (req, res) => {
  try {
    const {
      email,
      password: oldPassword,
      newPassword,
      firstName,
      lastName,
    } = req.body

    const { userId } = req.cookies

    const user = await isUserExistQuery(userId)
    if (!user[0]) {
      throw new Error("משתמש לא נמצא")
    }

    const isSamePassword = await bcrypt.compare(oldPassword, user[0].password)

    if (!isSamePassword) {
      throw new Error("סיסמא לא נכונה")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUser = await updateUserDetailsQuery({
      firstName,
      lastName,
      hashedPassword,
      email,
      userId,
    })

    res.status(200).json(updatedUser)
  } catch (error) {
    return res.status(401).json({ error: true, message: error.message })
  }
}

// @desc    get user details
// @route   GET /api/users
// @access  Public
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.cookies

    const user = await isUserExistQuery(userId)
    if (!user[0]) {
      throw new Error("משתמש לא נמצא")
    }

    res.status(200).json(user[0])
  } catch (error) {
    return res.status(401).json({ error: true, message: error.message })
  }
}

module.exports = { login, register, updateUserDetails, getUserDetails }
