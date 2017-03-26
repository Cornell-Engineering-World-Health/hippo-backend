var User = require('../models/user')
var Videocall = require('../models/videocall')

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

    clientSocket.on('user-online', function (data) {
      // console.log(data.email)
      User.findOne({ email: data.email }, function (err, user) {
        if (err) {
          // Invalid user name
        } else {
          Videocall.find({ participants: { $all: user } }, function (err, calls) {
            if (err) {
              // user is not in any call yet
            } else {
              // Add the user to all of their rooms
              for (var i = 0; i < calls.size; i++) {
                clientSocket.join(calls[i].name, null)
              }
            }
          })
        }
      })

      currentlyConnected[data.email] = clientSocket
      userEmail = data.email
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

    clientSocket.on('sessionDisconnected', function (data) { console.log('sessionDisconnected') })
    clientSocket.on('sessionConnected', function (data) {
      alertSessionConnection(data.sessionName, userEmail)
      console.log('sessionConnected')
    })
    clientSocket.on('streamCreated', function (data) { console.log('streamCreated') })
    clientSocket.on('frameRate', function (data) { console.log('frameRate') })
    clientSocket.on('hasAudio', function (data) { console.log('hasAudio') })
    clientSocket.on('hasVideo', function (data) { console.log('hasVideo') })
    clientSocket.on('videoDimensions', function (data) { console.log('videoDimensions') })
    clientSocket.on('videoType', function (data) { console.log('videoType') })
    clientSocket.on('streamDestroyed', function (data) { console.log('streamDestroyed') })
    clientSocket.on('hasAudio', function (data) { console.log('hasAudio') })
    clientSocket.on('hasVideo', function (data) { console.log('hasVideo') })
    clientSocket.on('videoDimensions', function (data) { console.log('videoDimensions') })
  })
}

/* eslint-disable */

// Creating a new room when a new session is created
// Rooms can only be connected to on the server side
module.exports.createNewRoom = function (name, participants) {
  console.log('creating a new room ' + name)
  io.of(name)

  // add all participants in this call to the room
  console.log(currentlyConnected)
  for (var i in participants) {
    if(participants[i].email in currentlyConnected)
      currentlyConnected[participants[i].email].join(name, null)
  }
}

module.exports.deleteRoom = function (name) {
  console.log('deleting room ' + name)
  io.sockets.in(name).leave(name)
}

// Alerting all users in a session when someone joins the call
// TODO: add this to the videocall get -> make sure you have the username of the user who made the request
module.exports.alertSessionConnection = function (name, joiner) {
  console.log('alerting a session')
  // broadcast to all of the users in the namespace 'name' that 'joiner' has
  // joined the call
  currentlyConnected[joiner].to(name).emit('user-has-connected', { joiner: joiner })
}
/* eslint-disable */
