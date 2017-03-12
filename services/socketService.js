  var express = require('express')
  var http = require('http').Server(express.app)
  var io = require('socket.io')(http)
  var User = require('../models/user')
  var Videocall = require('../models/videocall')

  var currentlyConnected = {}; //hash table

  // User connected
  io.on('connection', function (clientSocket) {
    // add this user to all of their perspective rooms
    // users are distinguished by username
    User.findOne({ email : clientSocket.id }, function(err, user) {
      if(err) {
        //Invalid user name
      }
      else {
        Videocall.find({ participants : { $all : user } }, function(err, calls) {
          if(err) {
            //user is not in any call yet
          }
          else {
            //Add the user to all of their rooms
            for(var i = 0; i < calls.size; i++)
            {
              clientSocket.join(calls[i].name, null)
            }
          }
        })
      }
    })

    currentlyConnected[clientSocket.id] = clientSocket;
  })

  // User disconnected
  io.on('connection', function (clientSocket) {
    // remove this user from the list of currently connected
    delete currentlyConnected[clientSocket.id]
  })

  // Creating a new room when a new session is created
  // Rooms can only be connected to on the server side
  function createNewRoom (name, participants) {
    io.of(name)

    // add all participants in this call to the room
    for(var i = 0; i < participants.length; i++) {
      currentlyConnected[participants[i]].join(name, null)
    }
  }

  // Alerting all users in a session when someone joins the call
  // TODO: add this to the videocall get -> make sure you have the username of the user who made the request
  function alertSessionConnection (name, joiner) {
    // broadcast to all of the users in the namespace 'name' that 'joiner' has
    // joined the call
    currentlyConnected[joiner].to(name).emit('user-has-connected', { joiner : joiner })
  }
