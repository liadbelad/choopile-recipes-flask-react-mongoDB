import React, { useContext } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ModalContext from "./store/ModalCtx/modal-context"
import ScrollToTop from "./componenets/ScrollToTop/ScrollToTop"
import MainNavbar from "./componenets/Navbar/MainNavbar"
import ModalForm from "./componenets/Modal/ModalForm"
import RegisterForm from "./componenets/Auth/RegisterForm"
import LoginForm from "./componenets/Auth/LoginForm"
import HomePage from "./pages/HomePage"
import RecipesPage from "./pages/RecipesPage"
import ErrorPage from "./pages/ErrorPage"
import SingleRecipePage from "./pages/SingleRecipePage/SingleRecipePage"
import NewRecipeDetailsPage from "./pages/NewRecipePages/NewRecipeDetailsPage"
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage"
import NewRecipeIngredientsPage from "./pages/NewRecipePages/NewRecipeIngredientsPage"
import NewRecipeInstructionsPage from "./pages/NewRecipePages/NewRecipeInstructionsPage"
import MyRecipesPage from "./pages/MyRecipesPage"
import EditRecipeDetailsPage from "./pages/EditRecipePages/EditRecipeDetailsPage"
import EditRecipeIngredientsPage from "./pages/EditRecipePages/EditRecipeIngredientsPage"
import EditRecipeInstructionsPage from "./pages/EditRecipePages/EditRecipeInstructionsPage"
import EditRecipeSuccessPage from "./pages/EditRecipePages/EditRecipeSuccessPage"
import NewRecipeSuccessPage from "./pages/NewRecipePages/NewRecipeSuccessPage"
import AboutUsPage from "./pages/AboutUsPage"
import NewRecipeErrorPage from "./pages/NewRecipePages/NewRecipeErrorPage"

function App() {
  const { modalContent, handleCloseModal, handleModalContent } =
    useContext(ModalContext)

  return (
    <Router>
      <ScrollToTop />
      <MainNavbar />
      <main className="py-5">
        <Switch>
          <Route path="/recipes" exact component={RecipesPage} />
          <Route path="/profile" exact component={UserProfilePage} />
          <Route path="/about" exact component={AboutUsPage} />
          <Route path="/my-recipes" exact component={MyRecipesPage} />
          <Route
            path="/recipes/new/details"
            exact
            component={NewRecipeDetailsPage}
          />
          <Route
            path="/recipes/new/ingredients"
            exact
            component={NewRecipeIngredientsPage}
          />
          <Route
            path="/recipes/new/instructions"
            exact
            component={NewRecipeInstructionsPage}
          />
          <Route
            path="/recipes/edit/details"
            exact
            component={EditRecipeDetailsPage}
          />
          <Route
            path="/recipes/edit/ingredients"
            exact
            component={EditRecipeIngredientsPage}
          />
          <Route
            path="/recipes/edit/instructions"
            exact
            component={EditRecipeInstructionsPage}
          />
          <Route
            path="/recipes/edit/success"
            exact
            component={EditRecipeSuccessPage}
          />
          <Route
            path="/recipes/new/success"
            exact
            component={NewRecipeSuccessPage}
          />
          <Route
            path="/recipes/new/error"
            exact
            component={NewRecipeErrorPage}
          />
          <Route path="/recipes/:id" exact component={SingleRecipePage} />
          <Route path="/" exact component={HomePage} />
          <Route path="*" component={ErrorPage} />
        </Switch>

        <ModalForm>
          {modalContent === "register" ? (
            <RegisterForm
              handleCloseModal={handleCloseModal}
              handleModalContent={handleModalContent}
            />
          ) : (
            <LoginForm
              handleCloseModal={handleCloseModal}
              handleModalContent={handleModalContent}
            />
          )}
        </ModalForm>
      </main>
    </Router>
  )
}

export default App
