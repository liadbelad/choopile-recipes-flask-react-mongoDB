import React, { useContext } from "react"
import ModalContext from "../../store/ModalCtx/modal-context"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import styles from "./ModalForm.module.scss"

const ModalForm = ({ children }) => {
  const { showModal, handleCloseModal } = useContext(ModalContext)

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      animation={false}
      className="m-auto"
    >
      <Modal.Header className={`${styles.header} mt-2 w-100 `}>
        <Modal.Title as="h2" className="mx-auto">
          CHOOPILLE
        </Modal.Title>
        <Button
          onClick={handleCloseModal}
          variant="link"
          style={{ cursor: "pointer" }}
          className={styles["close-btn"]}
        >
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body className="form-modal-body">{children}</Modal.Body>
    </Modal>
  )
}

export default ModalForm
