const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const key = require("../../config/key")
const bcrypt = require("bcryptjs")
const User = require("../../model/Users")
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/jwtverify")

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).send("Error in fetching data")
  }
})

router.post(
  "/",
  [
    check("email", "email is required").isEmail(),
    check("password", "Password should not be empty")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const userMail = await User.findOne({ email })

      if (!userMail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email does not exists" }] })
      }

      const isMatch = await bcrypt.compare(password, userMail.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "password is incorrect" }] })
      }

      const payload = {
        user: {
          id: userMail.id
        }
      }

      jwt.sign(payload, key.jwtSecret, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err

        res.json(token)
      })
    } catch (err) {
      console.log(err)
      res.status(500).send("server login error")
    }
  }
)

module.exports = router
