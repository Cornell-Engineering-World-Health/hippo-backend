var express = require('express')
var router = express.Router()
var OpenTok = require('opentok')
var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
var Videocall = require('../models/videocall')
var videoServices = require('../services/videos')

// ROUTE - create a session, return session and token
/**
 * @swagger
 * /videos:
 *   post:
 *     description: Create a Session
 *     tags: [Session]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Session name
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *            $ref: '#/definitions/SessionName'
 *     responses:
 *       200:
 *         description: Session successfully created
 *         schema:
 *           type: object
 *           $ref: '#/definitions/newSession'
 *       500:
 *         description: 500 Internal Server Error
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Error'
 */
router.post('/', function (req, res) {
  // create sessionId
  opentok.createSession(function (err, session) {
    if (err) {
      res.send(err)
    }

    var video = new Videocall()
    randName = videoServices.generateChatName(function (name) {
      video.name = name
      video.sessionId = session.sessionId
      video.tokenId = session.generateToken()

      console.log("adding vid with name: " + name)

      video.save(function (err) {
        if (err) {
          res.send(err)
        }

        res.json({ message: 'New session added!', data: video })
    })
    })
  })
})

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /videos/{video_name}:
 *   get:
 *     tags: [Session]
 *     description: Returns a Single Session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: video_name
 *         description: Session's Name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single session returned
 *         schema:
 *           $ref: '#/definitions/Session'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/:video_name', function (req, res) {
  Videocall.findOne({ name: req.params.video_name }, function (err, video) {
    if (err) {
      res.send(err)
    }

    res.json(video)
  })
})

module.exports = router
