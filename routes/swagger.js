var express = require('express')
var router = express.Router()
var moment = require('moment')
var jwt = require('jwt-simple')

var User = require('../models/user')
var Errors = require('../resources/errors')

// Generate JSON Web Token
function createJWT (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  }
  return jwt.encode(payload, process.env.JWT_SECRET)
}

router.get('/auth', function (req, res) {
  User.findOne({ 'google.id': 8378 }, function (err, user) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_OAUTH(err))
    }
    if (user == null) {
      var user = new User()
      user.google.id = 8378
      user.firstName = "Test"
      user.lastName = "User"
      user.email = "testuser@testing.com"
      user.calls = []
      user.contacts = []
      user.save(function (err, user) {
        if (err) {
          return res.status(500).json(Errors.INTERNAL_OAUTH(err))
        }
        var token = createJWT(user)
        return res.send({ token: token })
      })
    }
    var token = createJWT(user)
    return res.send({ token: token })
  })
})

module.exports = router
