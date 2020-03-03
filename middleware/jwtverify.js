const key = require("../config/key")
const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token")

  if (!token) {
    return res.status(401).json({ msg: "No token , authorization denied" })
  }

  try {
    const decode = jwt.verify(token, key.jwtSecret)
    req.user = decode.user
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "error in jwt middleware" })
  }
}
