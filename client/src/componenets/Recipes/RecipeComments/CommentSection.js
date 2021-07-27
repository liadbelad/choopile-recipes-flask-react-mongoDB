import React, { useState } from "react"
import AddCommentInput from "./AddCommentInput"
import CommentList from "./CommentList"

const CommentSection = ({ comments }) => {
  const [newComments, setNewComments] = useState(null)
  const commentsToShow = newComments || comments

  const handleShowNewCommentList = (newComments) => {
    setNewComments(newComments)
  }

  return (
    <>
      <h3>תגובות</h3>
      <AddCommentInput handleShowNewCommentList={handleShowNewCommentList} />
      <CommentList comments={commentsToShow} />
    </>
  )
}

export default CommentSection
