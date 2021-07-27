require("dotenv").config()

async function connectDB() {
  const mysql = require("mysql2/promise")
  const connection = await mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
  })
  console.log(`MySql database is connected`.cyan.underline)

  return connection
}

const connection = connectDB()
module.exports = connection
