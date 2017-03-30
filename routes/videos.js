  var express = require('express')
  var router = express.Router()
  var OpenTok = require('opentok')
  var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)

  var Videocall = require('../models/videocall')
  var videoServices = require('../services/videos')

  var User = require('../models/user')
  var Errors = require('../resources/errors')
  var moment = require('moment')

  var Q = require('q')

// ROUTE - create a session, return session and token
/**
 * @swagger
 * /videos:
 *   post:
 *     description: |
 *       Create a Session with a specified start time, end time, and invited participants.
 *       Returns the video session with users invited and token for joining.
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
 *         schema:
 *           $ref: '#/definitions/SessionParams'
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
        return res.status(500).json(Errors.INTERNAL_READ(err))
      }
      var video = new Videocall()
      videoServices.generateChatName(function (err, name) {
        if (err) {
          return res.status(500).json(Errors.INTERNAL_READ(err))
        }
        video.name = name
        video.sessionId = session.sessionId
        video.datetime = Date.now()
        if (req.body.startTime) {
          video.startTime = req.body.startTime
        } else {
          video.startTime = Date.now()
        }

        if (req.body.endTime) {
          video.endTime = req.body.endTime
        } else {
          var m = moment(video.startTime)
          m.add(1, 'hours')
          video.endTime = m.format()
        }

        var participants = []

        if (!req.body.invitedUserIds) {
          req.body.invitedUserIds = []
        }

        for (var userId of req.body.invitedUserIds) {
          participants.push(User.findOne({ userId: userId }).exec())
        }
        Q.all(participants)
        .then(function (users) {
          video.participants = []
          if (users.length > 0) {
            for (var i = 0; i < users.length; i++) {
              if (users[i] == null) {
                return res.status(404).json(Errors.USER_NOT_FOUND(req.body.invitedUserIds[i]))
              }
              // User verified to exist
              video.participants.push(users[i]._id)
            }
          }
          video.participants.push(req.user._id)
          return video.save()
        })
        .then(function (video) {
          if (err) {
            return res.status(500).json(Errors.INTERNAL_WRITE(err))
          }
          // Populate participants of the call
          video.populate('participants', function (err) {
            if (err) {
              return res.status(500).json(Errors.INTERNAL_READ(err))
            }
            // Generate a token
            var tokenOptions = {}
            tokenOptions.role = 'publisher'
            var token = opentok.generateToken(session.sessionId, tokenOptions)

            video = video.toObject()
            video.tokenId = token

            req.app.get('socketService').createNewRoom(name, video.participants)

            res.json({ message: 'Calling user', data: video })
          })
        })
        .catch(function (err) {
          console.log('Q catch err: ' + err)
          return res.status(500).json(Errors.INTERNAL_DB(err))
        })
      })
    })
  })

// ROUTE - get all sessions
/**
 * @swagger
 * /videos:
 *   get:
 *     description: Get all Sessions.
 *     tags: [Session]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Sessions successfully returned.
 *         schema:
 *           type: array
 *           items:
 *            $ref: '#/definitions/Session'
 *       500:
 *         description: 500 Internal Server Error
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Error'
 */
  router.get('/', function (req, res) {
    Videocall.find(function (err, videos) {
      if (err) {
        res.status(500).json(Errors.INTERNAL_READ(err))
        return
      }
      res.json(videos)
    })
  })

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /videos/{video_name}:
 *   get:
 *     tags:   [Session]
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
 *           $ref: '#/definitions/SessionWithToken'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
  router.get('/:video_name', function (req, res) {
    Videocall
    .findOne({ name: req.params.video_name })
    .populate('participants')
    .exec(function (err, video) {
      if (err) {
        return res.status(500).json(Errors.INTERNAL_READ(err))
      }
      if (video == null) {
        return res.status(404).json(Errors.CALL_NOT_FOUND(req.params.video_name))
      } else {
        var tokenOptions = {}
        tokenOptions.role = 'publisher'

        // Generate a token.
        var token = opentok.generateToken(video.sessionId, tokenOptions)
        video = video.toObject()
        video.tokenId = token

        // NEEDS TO BE CHANGED TO THE ACTUAL NAME OF THE PARTICIPANT WHO JOINED
        // req.app.get('socketService').alertSessionConnection(video.name, video.participants[0].email)

        res.json(video)
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
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A single session deleted.
 *         schema:
 *           $ref: '#/definitions/deleteResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 */
  router.delete('/:video_name', function (req, res) {
    Videocall.findOneAndRemove({ name: req.params.video_name }, function (err, video) {
      if (err) {
        return res.status(500).json(Errors.INTERNAL_READ(err))
      }
      if (video == null) {
        return res.json({
          message: 'Session with name: \'' + req.params.video_name + '\' was not found in the database. ' +
                  'It may have already been deleted',
          name: req.params.video_name
        })
      } else {
      // Delete the socket room
      // console.log(req.app.get('socketService').deleteRoom)
      // req.app.get('socketService').deleteRoom(video.name)

        res.json({
          message: 'Session with name: \'' + req.params.video_name + '\' has been deleted.',
          name: req.params.video_name
        })
      }
    })
  })

  module.exports = router
