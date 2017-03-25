module.exports = function(io) {

  //var express = require('express')
  //var app = require('../app.js')
  //var io = GLOBAL.io
  var User = require('../models/user')
  var Videocall = require('../models/videocall')

  var currentlyConnected = {} // hash table

  test = 'hi'
  // connect the user names with id if cannot change id with another emit
  console.log('setup')

  // New user has sent their info
  io.on('connection', function (clientSocket) {
    console.log('got connection')
    // add this user to all of their perspective rooms
    // users are distinguished by username
    clientSocket.emit('confirmation', {msg : 'it worked'})

    clientSocket.on('user-online', function (data) {
      console.log(data.email)
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
  createNewRoom = function (name, participants) {
    console.log('creating a new room')
    io.of(name)

    // add all participants in this call to the room
    for (var i = 0; i < participants.length; i++) {
      currentlyConnected[participants[i]].socket.join(name, null)
    }
  }

  // Alerting all users in a session when someone joins the call
  // TODO: add this to the videocall get -> make sure you have the username of the user who made the request
  alertSessionConnection = function (name, joiner) {
    console.log('alerting a session')
    // broadcast to all of the users in the namespace 'name' that 'joiner' has
    // joined the call
    currentlyConnected[joiner].socket.to(name).emit('user-has-connected', { joiner: joiner })
  }

  return this
}
