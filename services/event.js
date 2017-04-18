var CallEvent = require('../models/callEvent')

exports.addConnectionCreatedEvent = function addConnectionCreatedEvent (callEvent) {
  try {
    console.log('connection created event. client:' + callEvent.clientId + 'connectionId:' + callEvent.userConnectionId)
    CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', userId: callEvent.clientId}, function (err, connection) {
      if (err) {
        console.log('error 1')
        console.log(err)
      } else {
        if (connection == null) {
          console.log('clientId is unique')
          CallEvent.findOne({ callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId }, function (err, connection2) {
            if (err) {
              console.log('error 2')
              console.log(err)
            } else {
              if (connection2 == null) {
                console.log('connectionId (and clientId) is unique. Saving.')
                var event = new CallEvent()
                event.callId = callEvent.sessionName
                event.timestamp = callEvent.timestamp
                event.eventType = {}
                event.eventType.event = callEvent.eventType
                event.eventType.connectionId = callEvent.userConnectionId
                event.userId = callEvent.clientId
                event.save(function (err, eventInfo) {
                  if (err) {
                    console.log(3)
                    console.log(err)
                  } else {
                    console.log('[CDR]')
                    console.log(eventInfo)
                  }
                })
              } else {
                console.log('CDR was found with connectionId:' + callEvent.userConnectionId)
              }
            }
          })
        } else {
          console.log('CDR was found with clientId:' + callEvent.clientId)
        }
      }
    })
  } catch (err) {
    console.log('try-catch error: addConnectionCreatedEvent')
    console.log(err)
  }
}

exports.addStreamCreatedEvent = function addStreamCreatedEvent (callEvent) {
  console.log('Stream creation for user:' + callEvent.userConnectionId)
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
    } else {
      console.log(connectionEvent)
      var event = new CallEvent()
      event.callId = callEvent.sessionName
      event.timestamp = callEvent.timestamp
      event.eventType = {}
      event.eventType.event = callEvent.eventType
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
          } else {
            console.log(eventInfo)
          }
        })
      } else {
        console.log('user rejoin error: addStreamCreatedEvent')
      }
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
  console.log('session disconnect for user: ' + callEvent.userId)
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
    } else {
      console.log(eventInfo)
    }
  })
}

exports.addFrameRateEvent = function addFrameRateEvent (callEvent) {
  console.log('FrameRate for user:' + callEvent.userConnectionId)
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

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
          } else {
            console.log(eventInfo)
          }
        })
      } else {
        console.log('user rejoin error: addFrameRateEvent')
      }
    }
  })
}

exports.addAudioChangeEvent = function addAudioChangeEvent (callEvent) {
  console.log('audio on off for user:' + callEvent.userConnectionId)
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {
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
          } else {
            console.log(eventInfo)
          }
        })
      } else {
        console.log('user rejoin error: addAudioChangeEvent')
      }
    }
  })
}

exports.addVideoChangeEvent = function addVideoChangeEvent (callEvent) {
  console.log('video on off for user:' + callEvent.userConnectionId)
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

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
          } else {
            console.log(eventInfo)
          }
        })
      } else {
        console.log('user rejoin error: addVideoChangeEvent')
      }
    }
  })
}

exports.addVideoTypeChangeEvent = function addVideoTypeChangeEvent (callEvent) {
  console.log('videotypechange for user:' + callEvent.userConnectionId)
  CallEvent.findOne({callId: callEvent.sessionName, 'eventType.event': 'connectionCreated', 'eventType.connectionId': callEvent.userConnectionId}, function (err, connectionEvent) {
    if (err) {

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
          } else {
            console.log(eventInfo)
          }
        })
      } else {
        console.log('user rejoin error: addVideoTypeChangeEvent')
      }
    }
  })
}

exports.addVideoDimensionsChangeEvent = function addVideoDimensionsChangeEvent (callEvent) {
  console.log('dimensions change for user:' + callEvent.userConnectionId)
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
      if (connectionEvent != null) {
        event.userId = connectionEvent.userId
        event.save(function (err, eventInfo) {
          if (err) {
          } else {
            console.log(eventInfo)
          }
        })
      } else {
        console.log('user rejoin error: addStreamCreatedEvent')
      }
    }
  })
}
