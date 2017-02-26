var animals = require('../resources/animals')

exports.generateChatName = function () {
  var randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  var randomInt = Math.floor(Math.random() * 100)
  var chatName = randomAnimal + randomInt

  // check if chatName already exists

  return chatName
}
