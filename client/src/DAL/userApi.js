import axios from "axios"
import { CONFIG } from "../utills/js/constants"

export const updateUserDetails = async (newUserDetails) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/users`,
      newUserDetails,
      CONFIG
    )
    return data
  } catch (error) {
    return error.response.data
  }
}

export const getUserDetails = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/users`, CONFIG)
    return data
  } catch (error) {
    return error.response.data.message
  }
}
