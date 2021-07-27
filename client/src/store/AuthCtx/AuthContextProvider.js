import React, { useState, useEffect } from "react"
import { login, register } from "../../DAL/api"
import { getUserDetails } from "../../DAL/userApi"
import AuthContext from "./auth-context"

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userFirstName, setUserFirstName] = useState("")

  const handleLogin = async (userLogin) => {
    const response = await login(userLogin)
    if (response.userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(response.userInfo))
      setIsLoggedIn(true)
      setUserFirstName(response.userInfo.firstName)
    }
    return response
  }

  const handleRegister = async (newUser) => {
    const userRegister = await register(newUser)
    return userRegister
  }

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    setIsLoggedIn(false)
    setUserFirstName("")
  }

  const handleUserDetailsUpdate = async (newFirstName) => {
    setUserFirstName(newFirstName)
    const userDetails = await getUserDetails()
    localStorage.setItem("userInfo", JSON.stringify(userDetails))
  }

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (storedUserInfo) {
      setIsLoggedIn(true)
      setUserFirstName(storedUserInfo.firstName)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userFirstName,
        handleLogin,
        handleLogout,
        handleRegister,
        handleUserDetailsUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
