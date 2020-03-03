const express = require("express")
const app = express()
const ConnectionDb = require("./config/db")
const cookieSession = require("cookie-session")
const passport = require("passport")
const passportStart = require("./config/Passport")
const session = require("express-session")
const tester = require("./middleware/tester")

ConnectionDb()

passportStart(passport)

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
)

app.use(express.json({ extended: false }))

app.use(passport.initialize())
app.use(passport.session())

// app.use("/tester", tester)  => simple middleware when u hit tester endpoint middleware calls doesn't matter get or post request

app.use("/api/register", require("./routes/api/users"))
app.use("/api/login", require("./routes/api/login"))
app.use("/api/pass", require("./routes/api/pass"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Port is running on ${PORT}`))
