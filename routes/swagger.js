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
  User.find({ }, function (err, users) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_OAUTH(err))
    }
    if (users.length == 0) {
      return res.status(404).json(Errors.USER_NOT_FOUND(req.params.user_id))
    }
    var token = createJWT(users[0])
    res.send({ token: token })
  })
})

module.exports = router
