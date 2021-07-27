import React from "react"
import Form from "react-bootstrap/Form"
import FormErrorMessages from "../../Auth/FormErrorMessages"

const AddRecipeFormInput = ({
  formik,
  title,
  type,
  id,
  name,
  as,
  placeholder,
  width,
  rows = 3,
}) => {
  const inputValue = formik.values[name]
  return (
    <Form.Group className={width && width}>
      {title && <Form.Label className="font-weight-bold"> {title} </Form.Label>}

      <Form.Control
        as={as}
        placeholder={placeholder}
        id={id}
        type={type}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={inputValue}
        rows={rows}
      />
      {formik.touched[`${name}`] && formik.errors[`${name}`] && (
        <FormErrorMessages error={formik.errors[`${name}`]} />
      )}
    </Form.Group>
  )
}

export default AddRecipeFormInput
