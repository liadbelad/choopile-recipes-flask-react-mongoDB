import React from "react"
import { Alert } from "react-bootstrap"

const Message = ({
  variant = "danger",
  children,
  fontSize = "0.8rem",
  width = "auto",
  height = "auto",
}) => {
  return (
    <Alert style={{ fontSize, width, height }} variant={variant}>
      {children}
    </Alert>
  )
}

export default Message
