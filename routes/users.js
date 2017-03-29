var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Errors = require('../resources/errors')

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     description: Returns all Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Public info of all registered users returned
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/', function (req, res) {
  User
  .find({ })
  .exec(function (err, users) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_READ(err))
    }
    // Return a limited scope of the user's actual information
    var userList = []
    for (var user of users) {
      userList.push({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      })
    }
    res.json({ users: userList })
  })
})

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     tags: [Users]
 *     description: Returns a Single User based on userId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         description: User's unique id nummber
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single user returned
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/:user_id', function (req, res) {
  User
  .findOne({ userId: req.params.user_id })
  .exec(function (err, user) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_READ(err))
    }
    if (user == null) {
      return res.status(404).json(Errors.USER_NOT_FOUND(req.params.user_id))
    }
    // Return a limited scope of the user's actual information
    res.json({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })
  })
})

module.exports = router
