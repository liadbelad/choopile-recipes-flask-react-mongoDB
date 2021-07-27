import React, { useCallback } from "react"
import Select from "react-select"
import { CUSTOM_SELECT_STYLES } from "../../utills/js/constants"

const CustomSelect = ({
  onChange,
  options,
  value,
  name,
  className,
  placeholder,
}) => {
  const defaultValue = useCallback((options, selectedOption) => {
    if (!selectedOption.value) {
      return ""
    }

    return options
      ? options.find((option) => option.value === selectedOption.value)
      : ""
  }, [])

  return (
    <Select
      className={className && className}
      name={name}
      value={value && defaultValue(options, value)}
      options={options}
      onChange={(selectedOption) => onChange(selectedOption)}
      placeholder={placeholder}
      styles={CUSTOM_SELECT_STYLES}
    />
  )
}

export default CustomSelect
