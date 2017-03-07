var express = require('express')
var router = express.Router()
var passport = require('../resources/passport')

router.get('/google', passport.authenticate('google', {
  scope : ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: 'http://google.com',
  failureRedirect: '/'
}))

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  return res.status(401).json(Errors.NOT_AUTHORIZED())
}

module.exports = router
