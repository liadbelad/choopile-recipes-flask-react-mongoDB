const hashing = () => async (req, res, next) => {
  if (!req.body.password.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
}

module.exports = hashing
