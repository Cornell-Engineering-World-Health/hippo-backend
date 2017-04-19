var User = require('../models/user')
var Videocall = require('../models/videocall')
var cdr = require('../services/event')

var currentlyConnected = [] // associative array
var io

module.exports.init = function (socketIo) {
  io = socketIo
  // New user has sent their info
  io.on('connection', function (clientSocket) {
    // add this user to all of their perspective rooms
    // users are distinguished by username
    clientSocket.emit('confirmation', {msg: 'it worked'})
    var userEmail = ''
    var userName = ''

    clientSocket.on('user-online', function (data) {
      // console.log(data.email)
      userEmail = data.email

      User.findOne({ email: data.email }, function (err, user) {
        if (err) {
          // Invalid user name
        } else {
          userName = user.firstName + ' ' + user.lastName
          Videocall.find({ participants: { $all: user } }, function (err, calls) {
            if (err) {
              // user is not in any call yet
            } else {
              // Add the user to all of their rooms
              for (var i in calls) {
                console.log('adding ' + userEmail + ' to room ' + calls[i].name)
                clientSocket.join(calls[i].name, null)
              }
            }
          })
        }
      })

      currentlyConnected[data.email] = clientSocket
      console.log('adding ' + data.email)
      console.log('currently connected: ' + Object.keys(currentlyConnected).length)
    })

    // User disconnected
    clientSocket.on('disconnect', function (data) {
      // remove this user from the list of currently connected
      for (var key in currentlyConnected) {
        if (currentlyConnected[key] === clientSocket) {
          console.log('removing ' + key)
          delete currentlyConnected[key]
        }
      }
      console.log('currently connected: ' + Object.keys(currentlyConnected).length)
    })

    clientSocket.on('sessionDisconnected', function (data) {
      module.exports.alertSessionDisconnection(data.sessionName, userEmail, userName)
      cdr.addSessionDisconnectionEvent(data)
    })
    clientSocket.on('sessionConnected', function (data) { // sessionConnected
      module.exports.alertSessionConnection(data.sessionName, userEmail, userName)
    })
    clientSocket.on('connectionCreated', function (data) { cdr.addConnectionCreatedEvent(data) })
    clientSocket.on('streamCreated', function (data) { cdr.addStreamCreatedEvent(data) })
    clientSocket.on('frameRate', function (data) { cdr.addFrameRateEvent(data) })
    clientSocket.on('hasAudio', function (data) { cdr.addAudioChangeEvent(data) })
    clientSocket.on('hasVideo', function (data) { cdr.addVideoChangeEvent(data) })
    clientSocket.on('videoDimensions', function (data) { cdr.addVideoDimensionsChangeEvent(data) })
    clientSocket.on('videoType', function (data) { cdr.addVideoTypeChangeEvent(data) })
  })
}

/* eslint-disable */

// Creating a new room when a new session is created
// Rooms can only be connected to on the server side
module.exports.createNewRoom = function (name, participants) {
  console.log('creating a new room ' + name)
  io.of(name)

  // add all participants in this call to the room
  for (var i in participants) {
    if(participants[i].email in currentlyConnected)
    {
      console.log('adding ' + participants[i].email + ' to room ' + name)
      currentlyConnected[participants[i].email].join(name, null)
    }
  }
}

// Alerting all users in a session when someone joins the call
// TODO: add this to the videocall get -> make sure you have the username of the user who made the request
module.exports.alertSessionConnection = function (name, joiner, username) {
  console.log('alerting a session ' + name)
  console.log('joiner ' + joiner)
  //var socketsInRoom 	= io.sockets.adapter.rooms[name]
  //console.log('people in room:')
  //for (var key in socketsInRoom) {
  //  console.log('-' + key)
  //}

  // broadcast to all of the users in the namespace 'name' that 'joiner' has
  // joined the call
  if(typeof currentlyConnected[joiner] !== "undefined")
    currentlyConnected[joiner].to(name).emit('user-has-connected', { joiner: username }, currentlyConnected[joiner].id)
}

module.exports.alertSessionDisconnection = function (name, leaver, username) {
  console.log('alerting a session ' + name)
  console.log('leaver ' + leaver)
  if(typeof currentlyConnected[leaver] !== "undefined")
    currentlyConnected[leaver].to(name).emit('user-has-disconnected', { leaver: username }, currentlyConnected[leaver].id)
}

module.exports.getNumberOfCallParticipants = function (name) {
  // Will this throw an error if no socket room with this name?
  try {
    if (io.sockets.adapter.rooms[name]) {
      return io.sockets.adapter.rooms[name].length
    }
    return 0
  } catch (err) {
    console.log(err)
  }
}
/* eslint-disable */
