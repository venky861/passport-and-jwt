module.exports = (req, res, next) => {
  res.send("this is middleware")
  next()
}
