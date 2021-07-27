import React from "react"
import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"

const ConffetiEffect = () => {
  const { width, height } = useWindowSize()

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      initialVelocityY={15}
      numberOfPieces={400}
      run={true}
    />
  )
}

export default ConffetiEffect
