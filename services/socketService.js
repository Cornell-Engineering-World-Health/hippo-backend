  var express = require('express')
  var http = require('http').Server(express.app)
  var io = require('socket.io')(http)
  var User = require('../models/user')
  var Videocall = require('../models/videocall')

  // User connected
  io.on('connection', function (client) {
    // add this user to all of their perspective namespaces
  })

  // Creating a new namespace when a new session is created
  function createNewNamespace (name) {
    io.of(name)
    // loop through all users in the session with this name, and add them to
    // the namespace if they are connected
  }

  // Alerting all users in a session when someone joins the call
  function alertSessionConnection (name, joiner, others) {
    // broadcast to all of the users in the namespace 'name' that 'joiner' has
    // joined the call
  }
