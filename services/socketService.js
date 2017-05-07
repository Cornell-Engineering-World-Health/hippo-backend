/*
 * This file contains the functions for socket.io integration.
 * It contains a memory of all users which are currently
 * connected through socket, and has rooms for all of their
 * calls.
 */

var User = require('../models/user')
var Videocall = require('../models/videocall')
var cdr = require('../services/event')

// Associative array of the users currently connected by socket
//    - Key is the user's email
//    - Value is the socket associated with that user
var currentlyConnected = []

// Allowing access to the socket server locally
var io

/*
 * Initialization of the socket server side
 */
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

      // connect the user's email to their socket
      currentlyConnected[data.email] = clientSocket
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

    // alert that a user disconnected from a call
    clientSocket.on('sessionDisconnected', function (data) {
      module.exports.alertSessionDisconnection(data.sessionName, userEmail, userName)
      cdr.addSessionDisconnectionEvent(data)
    })
    // alert that a user connected to a call
    clientSocket.on('sessionConnected', function (data) {
      module.exports.alertSessionConnection(data.sessionName, userEmail, userName)
    })
    // following functions are for Call Detail Record logging
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
  io.of(name)

  // add all participants in this call to the room
  for (var i in participants) {
    if(participants[i].email in currentlyConnected)
    {
      currentlyConnected[participants[i].email].join(name, null)
    }
  }
}

// Alerting all users in a session when someone joins the call
module.exports.alertSessionConnection = function (name, joiner, username) {
  // broadcast to all of the users in the namespace 'name' that 'joiner' has
  // joined the call
  if(typeof currentlyConnected[joiner] !== "undefined")
    currentlyConnected[joiner].to(name).emit('user-has-connected', { joiner: username }, currentlyConnected[joiner].id)
}

// Alerting all users in a session when someone exits the call
module.exports.alertSessionDisconnection = function (name, leaver, username) {
  if(typeof currentlyConnected[leaver] !== "undefined")
    currentlyConnected[leaver].to(name).emit('user-has-disconnected', { leaver: username }, currentlyConnected[leaver].id)
}

// returns the number of participants in a call
module.exports.getNumberOfCallParticipants = function (name) {
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
