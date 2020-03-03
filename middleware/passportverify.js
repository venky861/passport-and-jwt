const passport = require("passport")
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.send("redirect")
  }
}
