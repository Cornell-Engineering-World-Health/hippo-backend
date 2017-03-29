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

function addConnectionCreatedEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', userId: callEvent.clientId}, function (err, connection) {
    if (err) {
    } else {
      if (connection == null) {
        CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId, userId: callEvent.clientId}, function (err, connection2) {
          if (err) {
          } else {
            if (connection2 == null) {
              var event = new CallEvent()
              event.callId = callEvent.sessionName
              event.timestamp = callEvent.timestamp
              event.eventType = {}
              event.eventType.event = callEvent.eventType
              event.eventType.connectionId = callEvent.userConnectionId
              event.userId = callEvent.clientId
              event.save(function (err, eventInfo) {
                if (err) {
                } else {
                  console.log(eventInfo)
                }
              })
            }
          }
        })
      }
    }
  })
}
/**
function addConnectionDestroyEvent(callEvent){

  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId, userId: callEvent.clientId}, function (err, connection){
    if (err) {
    }
    else if(connection != null){
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.connectionId = callEvent.userConnectionId
      event.eventType.reason = callEvent.reason
      event.userId = callEvent.clientId

      event.save(function (err, eventInfo) {
        if (err) {
        }
        else{
          console.log(eventInfo)
        }
      })
    }
  })
}
*/

function addStreamCreatedEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.userId = connectionEvent.userId
      event.save(function (err, eventInfo) {
        if (err) {
        } else {
          console.log(eventInfo)
        }
      })
    }
  })
}

/**
function addStreamDestroyedEvent(callEvent){
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent){
    if (err) {

    }
    else{
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.reason = callEvent.reason
      event.userId = connectionEvent.userId

      event.save(function (err, eventInfo) {
        if (err) {
        }
        else{
          console.log(eventInfo)
        }
      })
    }
  })
}
*/

function addSessionDisconnectionEvent (callEvent) {
  var event = new CallEvent()
  event.callId = callEvent.sessionName
  event.timestamp = callEvent.timestamp
  event.eventType = {}
  event.eventType.event = callEvent.eventType
  event.eventType.reason = callEvent.reason
  event.userId = callEvent.userId

  event.save(function (err, eventInfo) {
    if (err) {} else {
      console.log(eventInfo)
    }
  })
}

function addFrameRateEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.frameRate = callEvent.frameRate
      event.userId = connectionEvent.userId
      event.save(function (err, eventInfo) {
        if (err) {
        } else {
          console.log(eventInfo)
        }
      })
    }
  })
}

function addAudioChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.hasAudio = callEvent.hasAudio
      event.userId = connectionEvent.userId
      event.save(function (err, eventInfo) {
        if (err) {
        } else {
          console.log(eventInfo)
        }
      })
    }
  })
}

function addVideoChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.hasVideo = callEvent.hasVideo
      event.userId = connectionEvent.userId

      event.save(function (err, eventInfo) {
        if (err) {
        } else {
          console.log(eventInfo)
        }
      })
    }
  })
}

function addVideoTypeChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.videoType = callEvent.videoType
      event.userId = connectionEvent.userId

      event.save(function (err, eventInfo) {
        if (err) {
        } else {
          console.log(eventInfo)
        }
      })
    }
  })
}

function addVideoDimensionsChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.dimensions = {}
      event.eventType.dimensions.width = callEvent.width
      event.eventType.dimensions.height = callEvent.height
      event.userId = connectionEvent.userId

      event.save(function (err, eventInfo) {
        if (err) {
        } else {
          console.log(eventInfo)
        }
      })
    }
  })
}

router.post('/', function (req, res) {
  addSessionDisconnectionEvent({
    eventType: 'sessionDisconnected',
    sessionName: 'tiger101',
    timestamp: new Date(90000060000),
    userId: 2,
    reason: 'clientDisconnected'
  })
  res.json({done: 'done'})
})

module.exports = router
