const passport = require("passport")
const localStrategy = require("passport-local").Strategy
const User2 = require("../model/Users2")

module.exports = passport => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        console.log("email", email)
        console.log("password", password)
        const user = await User2.findOne({ email: email })
        if (!user) {
          done(null, false, { message: "email id not registered" })
        } else {
          done(null, user)
          console.log(user)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
    console.log("seriallize user", user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await User2.findById(id)
    done(null, user)
  })
}
