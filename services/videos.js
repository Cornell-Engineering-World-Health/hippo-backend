var animals = require('../resources/animals')
var Videocall = require('../models/videocall')

exports.generateChatName = function generateName(callback) {

  var randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  var randomInt = Math.floor(Math.random() * 100)
  var chatName = randomAnimal + randomInt

  Videocall.findOne({ name: chatName }, function(err,video) {
    if(video == null) {
      callback(chatName)
    }
    else {
      generateName(callback)
    }
  })
}
