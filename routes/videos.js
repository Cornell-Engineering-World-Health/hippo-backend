var express = require('express')
var router = express.Router()
var OpenTok = require('opentok')
var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
var Videocall = require('../models/videocall')
var User = require('../models/user')
var UserService = require('../services/users')
var Errors = require('../resources/errors')

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
      res.status(500).json(Errors.INTERNAL_OPENTOK(err))
    }

    var video = new Videocall()
    video.name = req.body.name
    video.sessionId = session.sessionId
    video.tokenId = session.generateToken()
    video.datetime = Date.now()
    video.participants = []

    video.save(function (err) {
      if (err) {
        res.status(500).json(Errors.INTERNAL_WRITE(err))
      }
      res.json({ message: 'New session added!', data: video })
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
      res.status(500).json(Errors.INTERNAL_READ(err))
    }
    if (video == null) {
      res.status(404).json(Errors.CALL_NOT_FOUND(req.params.video_name))
    } else {
      res.json(video)
    }
  })
})

// ROUTE - takes a caller id of a user and a calling id and returns a new call
/**
 * @swagger
 * /videos/{called_id}/users/{calling_id}:
 *   post:
 *     tags: [Session]
 *     description: Returns a Single Session with two participants
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: caller_id
 *         description: Id of user creating call
 *         in: path
 *         required: true
 *         type: string
 *       - name: calling_id
 *         description: Id of the user that is being called
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
router.post('/:caller_id/users/:calling_id', function (req, res) {
  opentok.createSession(function (err, session) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_OPENTOK(err))
    }

    var video = new Videocall()
    video.name = req.body.name
    video.sessionId = session.sessionId
    video.tokenId = session.generateToken()
    video.datetime = Date.now()
    video.participants = [ req.params.caller_id, req.params.calling_id ]

    video.save(function (err) {
      if (err) {
        res.status(500).json(Errors.INTERNAL_WRITE(err))
      }

      UserService.addCall(req.params.caller_id, video.name, function (err) {
        if (err) {
          res.status(500).json(Errors.INTERNAL_WRITE(err))
        }
        UserService.addCall(req.params.calling_id, video.name, function (err) {
          if (err) {
            res.status(500).json(Errors.INTERNAL_WRITE(err))
          }
          res.json({ message: 'Calling user', data: video })
        })
      })
    })
  })


})

module.exports = router
