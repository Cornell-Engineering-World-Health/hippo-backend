var express = require('express')
var router = express.Router()
var moment = require('moment')
var User = require('../models/user')
var Errors = require('../resources/errors')

var Q = require('q')

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /self:
 *   get:
 *     tags: [Self]
 *     description: Returns a Single User object for the Authenticated User calling this route
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Authenticated user info is returned, including all calls
 *         schema:
 *           $ref: '#/definitions/SelfResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/', function (req, res) {
  User
  .findOne({ userId: req.user.userId })
  .populate([{ path: 'contacts' }, { path: 'calls', select: '-_id -__v' }])
  .exec(function (err, user) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_READ(err))
    }
    if (user == null) {
      return res.status(404).json(Errors.USER_NOT_FOUND(req.user.userId))
    }

    var allParticipants = []
    user = user.toObject()
    var currentTime = moment(Date.now())
    for (var i in user.calls) {
      var call = user.calls[i]
      call.active = true
      if (moment(call.endTime).isBefore(currentTime) && req.app.get('socketService').getNumberOfCallParticipants(call.name) === 0) {
        call.active = false
      }
      allParticipants.push(User.find({ '_id': { $in: call.participants } }).select('-_id -google -__v -contacts').exec())
    }
    Q.all(allParticipants).then(function (allParticipants) {
      for (var i in user.calls) {
        var calls = user.calls[i]
        calls.participants = allParticipants[i]
      }
      return res.json(user)
    })
  })
})

module.exports = router
