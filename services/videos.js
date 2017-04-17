var animals = require('../resources/animals')
var Videocall = require('../models/videocall')

module.exports.generateChatName = function generateName (callback) {
  var randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  var randomInt = Math.floor(Math.random() * 1000)
  var chatName = randomAnimal + randomInt

  Videocall.findOne({ name: chatName }, function (err, video) {
    if (err || video == null) {
      callback(err, chatName)
    } else {
      generateName(callback)
    }
  })
}

module.exports.validateUserInCall = function (user, participants) {
  var userInCall = false
  for (var videoParticipant of participants) {
    if (videoParticipant.userId === user.userId) {
      userInCall = true
    }
  }
  return userInCall
}
