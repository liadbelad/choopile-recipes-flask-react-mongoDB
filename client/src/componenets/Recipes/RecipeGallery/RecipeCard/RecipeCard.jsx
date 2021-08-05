import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { updateRecipeViewsById } from "../../../../DAL/recipesApi"
import styles from "./RecipeCard.module.scss"
import Aos from "aos"
import "aos/dist/aos.css"

const RecipeCard = ({ recipe }) => {
  const { _id, title, description, views, createdAt, mainImageUrl } = recipe
  const id = _id.$oid

  const date = createdAt.toLocaleString().slice(0, 10).replaceAll(".", "/")

  const handleViewsIncrement = () => {
    updateRecipeViewsById(id)
  }

  useEffect(() => {
    Aos.init({ duration: 750 })
  }, [])

  return (
    <article
      data-aos="fade-up"
      onClick={handleViewsIncrement}
      className={`${styles["recipe-container"]}`}
    >
      <Link to={`/recipes/${id.toString()}`}>
        <div
          style={{
            backgroundImage: `url(http://localhost:5000/images/${mainImageUrl})`,
          }}
          className={styles.image}
        ></div>
        <section className={`${styles["recipe-content"]} p-3`}>
          <div className={styles["recipe-header"]}>
            <p> {date} </p>
            <p className="mr-3">
              {views}{" "}
              <i
                className="fas fa-eye"
                style={{ color: "rgb(239, 66, 41)" }}
              ></i>
            </p>
          </div>
          <div className={styles["recipe-description"]}>
            <h5> {title} </h5>
            <p> {description} </p>
          </div>
        </section>
      </Link>
    </article>
  )
}

export default RecipeCard
