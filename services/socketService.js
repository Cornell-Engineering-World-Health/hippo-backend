module.exports = function(io) {

  var User = require('../models/user')
  var Videocall = require('../models/videocall')

  var currentlyConnected = {} // associative array

  test = 'hi'

  // New user has sent their info
  io.on('connection', function (clientSocket) {
    // add this user to all of their perspective rooms
    // users are distinguished by username
    clientSocket.emit('confirmation', {msg : 'it worked'})

    clientSocket.on('user-online', function (data) {
      //console.log(data.email)
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
      console.log('adding ' + data.email)
      console.log('currently connected: ' + Object.keys(currentlyConnected).length)
    })

    // User disconnected
    clientSocket.on('disconnect', function (data) {
      // remove this user from the list of currently connected
      for (var key in currentlyConnected) {
        if (currentlyConnected[key] === clientSocket)
        {
          console.log('removing ' + key)
          delete currentlyConnected[key]
        }
      }
      console.log('currently connected: ' + Object.keys(currentlyConnected).length)
    })
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

  deleteRoom = function (name) {
    console.log('deleting a room')
    io.sockets.in(name).leave(name)
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
