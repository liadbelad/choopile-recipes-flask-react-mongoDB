const connection = require("../config/db")

const isUserExistQuery = async (userId) => {
  const isUserExistQuery = `SELECT * FROM users WHERE id = ?`
  const connector = await connection
  const [userExist] = await connector.execute(isUserExistQuery, [userId])
  return userExist
}

const updateUserDetailsQuery = async ({
  userId,
  firstName,
  lastName,
  email,
  hashedPassword: password,
}) => {
  const updateUserQuery = `UPDATE users
  SET email = ?,password = ?,firstName = ?,lastName = ?
  Where id = ?`

  const connector = await connection

  await connector.execute(updateUserQuery, [
    email,
    password,
    firstName,
    lastName,
    userId,
  ])

  return isUserExistQuery(userId)
}

module.exports = { isUserExistQuery, updateUserDetailsQuery }
