import React from "react"
import ReactDOM from "react-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import App from "./App"
import AuthContextProvider from "./store/AuthCtx/AuthContextProvider"
import ModalContextProvider from "./store/ModalCtx/ModalContextProvider"
import NewRecipeContextProvider from "./store/NewRecipeCtx/NewRecipeContextProvider"

ReactDOM.render(
  <ModalContextProvider>
    <AuthContextProvider>
      <NewRecipeContextProvider>
        <App />
      </NewRecipeContextProvider>
    </AuthContextProvider>
  </ModalContextProvider>,
  document.getElementById("root")
)
