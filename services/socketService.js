  var express = require('express')
  var http = require('http').Server(express.app)
  var io = require('socket.io')(http)
  var User = require('../models/user')
  var Videocall = require('../models/videocall')

  var currentlyConnected = {} // hash table
  // connect the user names with id if cannot change id with another emit

  // New user has sent their info
  io.on('connection', function (clientSocket) {
    // add this user to all of their perspective rooms
    // users are distinguished by username
    clientSocket.on('', function (data) {
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

      currentlyConnected[data.clientEmail] = clientSocket
    })
  })

  // User disconnected
  io.on('connection', function (clientSocket) {
    // remove this user from the list of currently connected
    for (var i = 0; i < currentlyConnected.size; i++) {
      if (currentlyConnected[i] === clientSocket) { delete currentlyConnected[i] }
    }
  })

  // Creating a new room when a new session is created
  // Rooms can only be connected to on the server side
  /* eslint-disable no-use-before-define */
  function createNewRoom (name, participants) {
    io.of(name)

    // add all participants in this call to the room
    for (var i = 0; i < participants.length; i++) {
      currentlyConnected[participants[i]].socket.join(name, null)
    }
  }

  // Alerting all users in a session when someone joins the call
  // TODO: add this to the videocall get -> make sure you have the username of the user who made the request
  function alertSessionConnection (name, joiner) {
    // broadcast to all of the users in the namespace 'name' that 'joiner' has
    // joined the call
    currentlyConnected[joiner].socket.to(name).emit('user-has-connected', { joiner: joiner })
  }
  /* eslint-enable no-use-before-define http://standardjs.com/#how-do-i-hide-a-certain-warning*/
