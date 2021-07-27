import React from "react"
import bowlCategoryImg from "../../../utills/images/bowl-recipe-category.png"
import clockImg from "../../../utills/images/clock-recipe-prep-time.png"
import styles from "./OverviewDetails.module.scss"

const OverviewDetails = ({ category, prepTimeMins }) => {
  return (
    <ul className={styles["overview-container"]}>
      <li>
        <img
          src={bowlCategoryImg}
          alt="recipe bowl"
          width="40px"
          height="40px"
          className="mb-2"
        />
        <span className="font-weight-bold">{category}</span>
      </li>
      <li>
        <img
          src={clockImg}
          alt="recipe bowl"
          width="40px"
          height="40px"
          className="mb-2"
        />
        <span className="font-weight-bold">{prepTimeMins} דק'</span>
      </li>
    </ul>
  )
}

export default React.memo(OverviewDetails)
