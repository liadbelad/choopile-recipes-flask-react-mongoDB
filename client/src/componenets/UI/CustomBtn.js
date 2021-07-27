import React from "react"
import styles from "./CustomBtn.module.scss"

const CustomBtn = ({ className, text, disabled = false, onClick }) => {
  return (
    <button
      type="submit"
      className={`${styles.btn} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default CustomBtn
