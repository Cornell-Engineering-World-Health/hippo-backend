var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Errors = require('../resources/errors')

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /self:
 *   get:
 *     tags: [Self]
 *     description: Returns a Single User object for the Authenticated User
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Authenticated user info is returned, including all calls
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/', function (req, res) {
  User
  .findOne({ userId: req.user.userId })
  .populate('contacts calls')
  .exec(function (err, user) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_READ(err))
    }
    if (user == null) {
      return res.status(404).json(Errors.USER_NOT_FOUND(req.params.user_id))
    }
    res.json(user)
  })
})

module.exports = router
