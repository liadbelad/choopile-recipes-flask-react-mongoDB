import React from "react"
import { useLocation } from "react-router-dom"

import { ListGroup } from "react-bootstrap"
import styles from "./NewInstructionsList.module.scss"

const NewInstructionItem = ({
  instructionData,
  idx,
  handleDeleteNewInstruction,
  handleEditNewInstruction,
}) => {
  const { pathname } = useLocation()

  return (
    <ListGroup.Item key={idx} idx={idx} className={styles["listgroup-item"]}>
      <div>
        <i
          onClick={handleDeleteNewInstruction}
          style={{ cursor: "pointer", color: "red" }}
          className="fas fa-trash mx-2"
        ></i>
        {pathname === "/recipes/new/instructions" && (
          <i
            onClick={handleEditNewInstruction}
            style={{ cursor: "pointer", color: "#ffb605" }}
            className="fas fa-edit mx-2"
          ></i>
        )}
      </div>
      <p className="w-75"> {instructionData.instruction} </p>
    </ListGroup.Item>
  )
}

const NewInstructionsList = ({
  newRecipeInstructions,
  handleDeleteNewInstruction,
  handleEditNewInstruction,
}) => {
  return (
    <ListGroup>
      {newRecipeInstructions.map((instructionData, idx) => (
        <NewInstructionItem
          instructionData={instructionData}
          idx={idx}
          key={idx}
          handleDeleteNewInstruction={() => handleDeleteNewInstruction(idx)}
          handleEditNewInstruction={() =>
            handleEditNewInstruction(instructionData, idx)
          }
        />
      ))}
    </ListGroup>
  )
}

export default NewInstructionsList
