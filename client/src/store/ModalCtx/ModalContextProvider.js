import React, { useState } from "react"
import ModalContext from "./modal-context"

const ModalContextProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState("register")

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const handleModalContent = (newContent) => setModalContent(newContent)

  return (
    <ModalContext.Provider
      value={{
        modalContent,
        showModal,
        handleOpenModal,
        handleCloseModal,
        handleModalContent,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export default ModalContextProvider
