/**
* event.js contains functions that save events during call into the database
*/

var CallEvent = require('../models/callEvent')

/**
* Takes the JSON received from front-end during connection creation event and stores it in database.
* Since multiple clients will emit events containing the same connectionId, incoming callEvent's clientId and userConnectionID
* is checked for uniqueness. This connection creation event contains a user's Id and their corresponding connectionId,
* so connectionCreatedEvents can be used to retrieve userId given a connectionId.
*/
exports.addConnectionCreatedEvent = function addConnectionCreatedEvent (callEvent) {
  try {
    CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', userId: callEvent.clientId}, function (err, connection) {
      if (err) {
        console.log(err)
      } else {
        if (connection == null) {
          CallEvent.findOne({ callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId }, function (err, connection2) {
            if (err) {
              console.log(err)
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
                    console.log(err)
                  }
                })
              }
            }
          })
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

/**
* Takes the JSON received from front-end during stream creation event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
exports.addStreamCreatedEvent = function addStreamCreatedEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
      console.log(err)
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}

/**
* Takes the JSON received from front-end during a connection destroy event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
/**
exports.addConnectionDestroyEvent= function addConnectionDestroyEvent(callEvent){

  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId, userId: callEvent.clientId}, function (err, connection){
    if (err) {
      console.log(err)
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
          console.log(err)
        }
      })
    }
  })
}
*/

/**
* Takes the JSON received from front-end during stream destory event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
/**
exports.addStreamDestroyedEvent= function addStreamDestroyedEvent(callEvent){
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent){
    if (err) {
      console.log(err)
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
          console.log(err)
        }
      })
    }
  })
}
*/

/**
* Takes the JSON received from front-end during session disconnection event and stores it in database.
* ConnectionCreatedEvents need not be queried because userId is accessible.
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
    if (err) {
      console.log(err)
    }
  })
}

/**
* Takes the JSON received from front-end during Frame Rate Change event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
exports.addFrameRateEvent = function addFrameRateEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
      console.log(err)
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.frameRate = callEvent.frameRate
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}

/**
* Takes the JSON received from front-end during Audio On/Off Change event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
exports.addAudioChangeEvent = function addAudioChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
      console.log(err)
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.hasAudio = callEvent.hasAudio
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}

/**
* Takes the JSON received from front-end during Video On/Off Change event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
exports.addVideoChangeEvent = function addVideoChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
      console.log(err)
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.hasVideo = callEvent.hasVideo
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}

/**
* Takes the JSON received from front-end during Video Type Change event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
exports.addVideoTypeChangeEvent = function addVideoTypeChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
      console.log(err)
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.videoType = callEvent.videoType
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}

/**
* Takes the JSON received from front-end during Video Dimensions Change event and stores it in database.
* ConnectionCreatedEvents are used to retrieve the userId given the connectionId.
*/
exports.addVideoDimensionsChangeEvent = function addVideoDimensionsChangeEvent (callEvent) {
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
      console.log(err)
    } else {
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      event.eventType.dimensions = {}
      event.eventType.dimensions.width = callEvent.width
      event.eventType.dimensions.height = callEvent.height
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}
