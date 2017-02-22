var express = require('express')
var router = express.Router()
var OpenTok = require('opentok')
var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
var Videocall = require('../models/videocall')

// ROUTE - create a session, return session and token
router.post('/', function (req, res) {
  // create sessionId
  opentok.createSession(function (err, session) {
    if (err) {
      res.send(err)
    }

    var video = new Videocall()
    video.name = req.body.name
    video.sessionId = session.sessionId
    video.tokenId = session.generateToken()

    video.save(function (err) {
      if (err) {
        res.send(err)
      }

      res.json({ message: 'New session added!', data: video })
    })
  })
})

// ROUTE - takes a code, and returns session and token
router.get('/:video_name', function (req, res) {
  Videocall.findOne({ name: req.params.video_name }, function (err, video) {
    if (err) {
      res.send(err)
    }

    res.json(video)
  })
})

module.exports = router
