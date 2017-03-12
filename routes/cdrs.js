var express = require('express')
var router = express.Router()

var CDR = require('../models/cdr')
var Errors = require('../resources/errors')

// ROUTE - get all sessions
/**
 * @swagger
 * /cdrs:
 *   get:
 *     description: Get all CDRs.
 *     tags: [CDR]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: hasVideo
 *         description: "\"Session included video\""
 *         in: query
 *         required: false
 *         type: boolean
 *       - name: disconnectReason
 *         description: String from Opentok API describing disconectReason.
 *         in: query
 *         required: false
 *         type: string
 *       - name: participantsId[]
 *         description: Participants ID Numbers
 *         in: query
 *         required: false
 *         type: array
 *         collectionFormat: multi
 *       - name: creationTime
 *         description: "Get all calls created after this date (format: (YYYY-MM-DDTHH:MM:SSZ). Can exclude any part for more general filter.)"
 *         in: query
 *         required: false
 *         type: string
 *       - name: destroyTime
 *         description: "Get all calls destroyed before this date (format: (YYYY-MM-DDTHH:MM:SSZ). Can exclude any part for more general filter.)"
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: CDRs successfully returned.
 *         schema:
 *           type: array
 *           items:
 *            $ref: '#/definitions/CdrResponse'
 *       500:
 *         description: 500 Internal Server Error
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Error'
 */
router.get('/', function (req, res) {
  if(req.query.creationTime != undefined){
  	req.query.creationTime = {$gte: req.query.creationTime}
  }
  if(req.query.destroyTime != undefined){
  	req.query.destroyTime = {$lte: req.query.destroyTime}
  }
 
  CDR.find(req.query,function (err, cdrs) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_READ(err))
      return
    }
    res.json(cdrs)
  })
})

module.exports = router