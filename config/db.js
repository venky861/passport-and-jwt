const mongoose = require("mongoose")
const key = require("./key")
const db = key.mongoURI

const ConnectDb = () => {
  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    console.log("mongodb connected")
  } catch (err) {
    console.log(err)

    process.exit(1)
  }
}

module.exports = ConnectDb
