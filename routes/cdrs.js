var express = require('express')
var router = express.Router()

var CallEvent = require('../models/callEvent')
var Errors = require('../resources/errors')
var cdrServices = require('../services/makeCdr')
var test = require('../services/event')
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
  cdrServices.makeCdr(req.params.callId, function(err, cdr){
    if(err === "INTERNAL_READ"){
      res.status(500).json(Errors.INTERNAL_READ(err))
      return
    }
    else if(err === "CALL_NOT_FOUND"){
      res.status(404).json(Errors.CALL_NOT_FOUND(req.params.callId))
    }
    else{
      res.json(cdr)
    }
  })
})

router.get('/user/:userId', function (req, res) {
    cdrServices.makeMultipleCdrs(req.params.userId, function(err, cdrs){
      if(err === "INTERNAL_READ"){
        res.status(500).json(Errors.INTERNAL_READ(err))
        return
      }
      else if(err === "CALL_NOT_FOUND"){
        res.status(404).json(Errors.CALL_NOT_FOUND(""))
      }
      else{
        res.json(cdrs)
      }
    })
})

router.post('/', function(req,res){
  test.addConnectionCreatedEvent({
                eventType : 'connectionCreated',
                sessionName : 'tiger202',
                timestamp : new Date(999990000000),
                clientId : 1,
                userConnectionId : "connnectionid900"
              })
  res.json({a:"a"})
})

module.exports = router
