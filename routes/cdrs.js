var express = require('express')
var router = express.Router()

var CallEvent = require('../models/callEvent')
var Errors = require('../resources/errors')

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
  CallEvent.find({ callId: req.params.callId }, function (err, events) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_READ(err))
      return
    }
    if (events.length == 0) {
      res.status(404).json(Errors.CALL_NOT_FOUND(req.params.callId))
    }
    var cdr = {}
    cdr.sessionName = events[0].callId
    cdr.creationTime = events[0].timestamp
    cdr.destroyTime = events[events.length - 1].timestamp
    cdr.callDuration = cdr.destroyTime.getTime() - cdr.creationTime.getTime()
    cdr.connections = []
    // cdr.disconnections=[]
    cdr.disconnections = []
    cdr.userIds = []

    cdr.streamCreations = []
    cdr.frameRates = []
    cdr.hasAudios = []
    cdr.hasVideos = []
    cdr.videoTypes = []

    var k = 0
    while (k < events.length) {
      if (events[k].eventType.event === 'connectionCreated') {
        cdr.connections.push('' + events[k].eventType.connectionId + ', ' + events[k].userId + ', ' + events[k].timestamp)
        var match = false
        for (var id in cdr.userIds) {
          if (events[k].userId === id) {
            match = true
          }
        }
        if (!match) {
          cdr.userIds.push(events[k].userId)
        }
      }
      /**
      else if(events[k].eventType.event == 'connectionDestroyed'){
        cdr.disconnections.push(""+events[k].userId+", "+events[k].eventType.reason+", "+events[k].timestamp)
      }
      */
      else if (events[k].eventType.event === 'sessionDisconnected') {
        cdr.disconnections.push('' + events[k].userId + ', ' + events[k].eventType.reason + ', ' + events[k].timestamp)
      } else if (events[k].eventType.event === 'streamCreated') {
        cdr.streamCreations.push('' + events[k].userId + ', ' + events[k].timestamp)
      }
      /**
      else if(events[k].eventType.event == 'streamDestroyed'){
        cdr.streamDestroyed.push(""+events[k].userId+", "+events[k].timestamp)
      }
      */
      else if (events[k].eventType.event === 'frameRate') {
        cdr.frameRates.push('' + events[k].userId + ', ' + events[k].eventType.frameRate + ', ' + events[k].timestamp)
      } else if (events[k].eventType.event === 'hasAudio') {
        cdr.hasAudios.push('' + events[k].userId + ', ' + events[k].eventType.hasAudio + ', ' + events[k].timestamp)
      } else if (events[k].eventType.event === 'hasVideo') {
        cdr.hasVideos.push('' + events[k].userId + ', ' + events[k].eventType.hasVideo + ', ' + events[k].timestamp)
      } else if (events[k].eventType.event === 'videoType') {
        cdr.videoTypes.push('' + events[k].userId + ', ' + events[k].eventType.videoType + ', ' + events[k].timestamp)
      }
      k++
    }
    res.json(cdr)
  })
})

module.exports = router
