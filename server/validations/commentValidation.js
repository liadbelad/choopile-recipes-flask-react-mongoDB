const Yup = require("yup")

const commentSchema = Yup.object({
  comment: Yup.string().required("*חובה"),
})

module.exports = { commentSchema }
