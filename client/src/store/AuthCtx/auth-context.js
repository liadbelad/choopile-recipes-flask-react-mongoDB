import React from "react"

// App wide state
const AuthContext = React.createContext({
  isLoggedIn: false,
  userFirstName: "",
  handleLogin: (loginUser) => {},
  handleRegister: (newUser) => {},
  handleLogout: () => {},
  handleUserDetailsUpdate: () => {},
})

export default AuthContext
