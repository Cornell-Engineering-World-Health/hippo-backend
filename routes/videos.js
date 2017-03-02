var express = require('express')
var router = express.Router()
var OpenTok = require('opentok')
var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
var Videocall = require('../models/videocall')
var videoServices = require('../services/videos')
var moment = require('moment')

// ROUTE - create a session, return session and token
/**
 * @swagger
 * /videos:
 *   post:
 *     description: Create a Session. Currently nothing required in body
 *     tags: [Session]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Session name
 *         in: body
 *         required: false
 *         type: string
 *       - name: time
 *         description: Scheduled time for the session to occur at
 *         in: body
 *         required: true
 *         type: string
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
      res.status(500).json({
        code: '500 Internal Server Error',
        detail: 'Internal Opentok error while creating a new session.'
      })
    }
    var video = new Videocall()
    videoServices.generateChatName(function (err, name) {
      if (err) {
        res.status(500).json({
          code: '500 Internal Server Error',
          detail: 'Internal Mongoose error while reading from database.'
        })
      }
      video.name = name
      video.sessionTime = req.time
      console.log('video name: ' + name)
      console.log('session time: ' + req.time)
      video.sessionId = session.sessionId
      var tokenOptions = {}
      tokenOptions.role = 'publisher'
      // Generate a token.
      var token = opentok.generateToken(session.sessionId, tokenOptions)

      video.save(function (err, video) {
        if (err) {
          res.status(500).json({
            code: '500 Internal Server Error',
            detail: 'Internal Mongoose error while writing to database.'
          })
        }
        video = video.toObject()
        video.tokenId = token
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
      res.status(500).json({
        code: '500 Internal Server Error',
        detail: 'Internal Mongoose error while reading from database.'
      })
    }
    if (video == null) {
      res.status(404).json({
        code: '404 Not Found',
        detail: 'Requested video name: \'' + req.params.video_name + '\' does not exist.'
      })
    } else {
      var tokenOptions = {}
      tokenOptions.role = 'publisher'
      // Generate a token.
      var token = opentok.generateToken(video.sessionId, tokenOptions)
      video = video.toObject()
      video.tokenId = token
      res.json(video)
    }
  })
})

// ROUTE - takes a code, and returns true if within the time range for the
//         session to begin, false otherwise
router.get('/:video_name', function (req, res) {
  Videocall.findOne({ name: req.params.video_name }, function (err, video) {
    if (err) {
      res.status(500).json({
        code: '500 Internal Server Error',
        detail: 'Internal Mongoose error while reading from database.'
      })
    }
    if (video == null) {
      res.status(404).json({
        code: '404 Not Found',
        detail: 'Requested video name: \'' + req.params.video_name + '\' does not exist.'
      })
    } else {
      video = video.toObject()
      var callTime = moment(video.sessionTime)
      var currentTime = moment()
      var difference = currentTime.diff(callTime, 'minutes')
      if (difference < 10) {
        res.json({ ready: true })
      } else {
        res.json({ ready: false })
      }
    }
  })
})

// ROUTE - takes a code, and deletes session
/**
 * @swagger
 * /videos/{video_name}:
 *   delete:
 *     tags: [Session]
 *     description: Deletes a Single Session
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
 *         description: A single session deleted.
 *         schema:
 *           $ref: '#/definitions/deleteSuccessMessage'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.delete('/:video_name', function (req, res) {
  Videocall.findOneAndRemove({ name: req.params.video_name }, function (err, video) {
    if (err) {
      res.status(500).json({
        code: '500 Internal Server Error',
        detail: 'Internal Mongoose error while reading from database.'
      })
    }
    if (video == null) {
      res.status(404).json({
        code: '404 Not Found',
        detail: 'Requested video name: \'' + req.params.video_name + '\' does not exist.'
      })
    } else {
      res.json({
        message: 'session with code: \'' + req.params.video_name + '\' has been deleted.',
        name: req.params.video_name
      })
    }
  })
})

module.exports = router
