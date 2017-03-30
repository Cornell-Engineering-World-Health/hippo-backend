var CallEvent = require('../models/callEvent')

exports.addConnectionCreatedEvent = function addConnectionCreatedEvent (callEvent) {
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

exports.addStreamCreatedEvent = function addStreamCreatedEvent (callEvent) {
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
exports.addConnectionDestroyEvent= function addConnectionDestroyEvent(callEvent){

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

/**
exports.addStreamDestroyedEvent= function addStreamDestroyedEvent(callEvent){
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

exports.addSessionDisconnectionEvent = function addSessionDisconnectionEvent (callEvent) {
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

exports.addFrameRateEvent = function addFrameRateEvent (callEvent) {
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

exports.addAudioChangeEvent = function addAudioChangeEvent (callEvent) {
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

exports.addVideoChangeEvent = function addVideoChangeEvent (callEvent) {
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

exports.addVideoTypeChangeEvent = function addVideoTypeChangeEvent (callEvent) {
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

exports.addVideoDimensionsChangeEvent = function addVideoDimensionsChangeEvent (callEvent) {
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
