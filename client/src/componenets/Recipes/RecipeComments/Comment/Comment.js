import React from "react"
import styles from "./Comment.module.scss"

const Comment = ({ createdAt, content, author }) => {
  const date = createdAt.toLocaleString().slice(0, 10).replaceAll(".", "/")

  return (
    <div className={styles["comment-body"]}>
      <span className={styles.author}> {author} </span>
      <small className="text-muted mr-2"> {date} </small>
      <p className="mt-2">{content}</p>
    </div>
  )
}

export default Comment
