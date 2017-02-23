var express = require('express')
var router = express.Router()
var video = require('../services/videos')

// ROUTE - create a session, return session and token
router.post('/', video.createSession)

// ROUTE - takes a code, and returns session and token
router.get('/:video_name', video.getVideo)

module.exports = router
