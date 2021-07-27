import React from "react"
import { Spinner } from "react-bootstrap"

const Loader = ({ width = "20px", height = "20px", marginBottom = "1rem" }) => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width,
        height,
        marginBottom,
        display: "block",
      }}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  )
}

export default Loader
