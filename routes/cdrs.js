var express = require('express')
var router = express.Router()

var Errors = require('../resources/errors')
var cdrServices = require('../services/makeCdr')
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
