/**
* /cdrs route
*/

var express = require('express')
var router = express.Router()

var Errors = require('../resources/errors')
var cdrServices = require('../services/makeCdr')

// ROUTE - get all events for a callId
/**
router.get('/:callId', function(req,res){
  CallEvent.find({ callId: req.params.callId }, function (err, events) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_READ(err))
      return
    }
    res.json(events)
  })
})
*/

// ROUTE - get one CDR with matching callId
/**
 * @swagger
 * /cdrs/{callId}:
 *   get:
 *     tags:   [CDR]
 *     description: Returns a Single CDR
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: CallId
 *         description: Session's Name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single CDR returned
 *         schema:
 *           $ref: '#/definitions/CDR'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/:callId', function (req, res) {
  cdrServices.getOneCdr(req.params.callId, function (err, cdr) {
    if (err === 'INTERNAL_READ') {
      res.status(500).json(Errors.INTERNAL_READ(err))
    } else if (err === 'CALL_NOT_FOUND') {
      res.status(404).json(Errors.CALL_NOT_FOUND(req.params.callId))
    } else {
      res.json(cdr)
    }
  })
})

// ROUTE - get all CDRS for a user
/**
 * @swagger
 * /cdrs/user/{userId}:
 *   get:
 *     description: Get all cdrs for a user.
 *     tags: [CDR]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: User's ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: CDRs successfully returned.
 *         schema:
 *           type: array
 *           items:
 *            $ref: '#/definitions/CDR'
 *       500:
 *         description: 500 Internal Server Error
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Error'
 */
router.get('/user/:userId', function (req, res) {
  cdrServices.getAllCdrs(req.params.userId, function (err, cdrs) {
    if (err === 'INTERNAL_READ') {
      res.status(500).json(Errors.INTERNAL_READ(err))
    } else if (err === 'CALL_NOT_FOUND') {
      res.status(404).json(Errors.CALL_NOT_FOUND(''))
    } else {
      res.json(cdrs)
    }
  })
})

module.exports = router
