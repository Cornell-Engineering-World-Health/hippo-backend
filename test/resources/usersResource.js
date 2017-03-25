var User = require('../../models/user')

var testUser1 = {
  firstName: 'Frank',
  lastName: 'Chan',
  email: 'frank.chan@company.com',
  contacts: []
}

var testUser2 = {
  firstName: 'Albert',
  lastName: 'Chung',
  email: 'albert.chung@company.com',
  contacts: []
}

// This one has a unique user id
var testUser3 = {
  userId: '135134',
  firstName: 'Sonia',
  lastName: 'Appasamy',
  email: 'sonia.appasamy@company.com',
  contacts: []
}

var newTestUser = function (testUser) {
  var newUser = new User()
  newUser.firstName = testUser.firstName
  newUser.lastName = testUser.lastName
  newUser.email = testUser.email
  newUser.contacts = testUser.contacts
  if (testUser.userId) {
    newUser.userId = testUser.userId
  }

  return newUser
}

var userResource = {
  testUser1: testUser1,
  testUser2: testUser2,
  testUser3: testUser3,
  newTestUser: newTestUser
}

module.exports = userResource
