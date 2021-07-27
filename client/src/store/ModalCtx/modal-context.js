import React from "react"

const ModalContext = React.createContext({
  showModal: false,
  modalContent: "",
  handleOpenModal: () => {},
  handleCloseModal: () => {},
  handleModalContent: (newContent) => {},
})

export default ModalContext
