import React from "react"
import Comment from "./Comment/Comment"

const CommentList = ({ comments = [] }) => {
  return (
    <>
      {comments.map(({ id, content, firstName, lastName, createdAt }) => {
        const fullName = `${firstName} ${lastName}`
        return (
          <Comment
            key={id}
            author={fullName}
            createdAt={createdAt}
            content={content}
          />
        )
      })}
    </>
  )
}

export default CommentList
