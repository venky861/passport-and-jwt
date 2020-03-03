const express = require("express")
const router = express.Router()
const User2 = require("../../model/Users2")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/login", (req, res) => {
  res.render("login")
})

router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", (req, res) => {
  const { email, password } = req.body
  let errors = []

  if (!email || !password) {
    errors.push({ msg: "plz enter all the fields" })
  }

  if (password.length < 4) {
    errors.push({ msg: "password should be atleast 4 charcters" })
  }
  console.log(errors)

  if (errors.length > 0) {
    res.status(500).send("error in passport route")
  } else {
    // validation passed

    User2.findOne({ email: email }).then(user => {
      if (user) {
        res.status(400).json({ erros: errors.array() })
      } else {
        const newUser = new User2({
          email,
          password
        })
        console.log(newUser)

        // hash password

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err

            newUser.password = hash
            await newUser
              .save()
              .then(user => {
                res.send("user registered")
              })
              .catch(err => console.log(err))
          })
        ) // bcrypt ends
      } //else ends
    }) // user.findOne record ends
  } // else ends
}) // post ends

//login

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(req.user)
})

router.get("/logout", (req, res) => {
  req.logout()

  res.redirect("logged out")
})

module.exports = router
