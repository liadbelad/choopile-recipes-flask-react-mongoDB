import React from "react"
import ListGroup from "react-bootstrap/ListGroup"

const Instruction = ({ instruction, idx }) => {
  return (
    <ListGroup.Item style={{ border: "none" }}>
      <strong style={{ color: "rgb(239, 66, 41)" }}> {idx}. </strong>{" "}
      {instruction}
    </ListGroup.Item>
  )
}

const RecipeInstructions = ({ instructions }) => {
  return (
    <>
      <h2> אופן ההכנה </h2>
      <ListGroup>
        {instructions.map(({ id, instruction }, idx) => (
          <Instruction key={id} instruction={instruction} idx={idx + 1} />
        ))}
      </ListGroup>
    </>
  )
}

export default RecipeInstructions
