const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const User = require("../../model/Users")
const jwt = require("jsonwebtoken")
const key = require("../../config/key")
const bcrypt = require("bcryptjs")

router.get("/", (req, res) => {
  res.send("this is from register")
})

router.post(
  "/",
  [
    check("email", "Please enter a email").isEmail(),
    check("password", "Password must be atleast 5characters").isLength({
      min: 5
    })
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const usermail = await User.findOne({ email })

      if (usermail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "email Id already registered" }] })
      }

      const user = await new User({ email, password })

      //password encrypt

      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(user.password, salt, async (err, hash) => {
          if (err) throw err

          user.password = hash
          await user.save()
        })
      )

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload, key.jwtSecret, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err

        res.json(token)
      })
    } catch (err) {
      console.log(err)
      res.status(500).send("server error")
    }
  }
)

module.exports = router
