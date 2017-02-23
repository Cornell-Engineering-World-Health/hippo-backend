var express = require('express')
var router = express.Router()
var OpenTok = require('opentok')
var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
var Videocall = require('../models/videocall')

/**
 * @swagger
 * definition:
 *   Session:
 *     properties:
 *       name:
 *         type: string
 *   getSession:
 *           properties:
 *             name:
 *                type: string
 *             tokenId:
 *                type: string
 *             sessionId:
 *                type: string
 *             id:
 *               type: string
 */

// ROUTE - create a session, return session and token
/**
 * @swagger
 * /api/videos:
 *   post:
 *     tags:
 *       - Session
 *     summary: Creates a new Session
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - name: session
 *         description: Session object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Session'
 *     responses:
 *       200:
 *         description: Successfully created
 */
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
/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     tags:
 *       - Sessions
 *     description: Returns a single session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: video_name
 *         description: Session's name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single session returned
 *         schema:
 *           $ref: '#/definitions/getSession'
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
