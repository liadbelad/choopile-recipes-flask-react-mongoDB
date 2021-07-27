import axios from "axios"

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
}

export const updateUserDetails = async (newUserDetails) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/users`,
      newUserDetails,
      config
    )
    return data
  } catch (error) {
    return error.response.data
  }
}

export const getUserDetails = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/users`, config)
    return data
  } catch (error) {
    return error.response.data.message
  }
}
