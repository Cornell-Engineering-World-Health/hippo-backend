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

var newTestUser = function (testUser) {
  var newUser = new User()
  newUser.firstName = testUser.firstName
  newUser.lastName = testUser.lastName
  newUser.email = testUser.email
  newUser.contacts = testUser.contacts

  return newUser
}

var userResource = {
  testUser1: testUser1,
  testUser2: testUser2,
  newTestUser: newTestUser
}

module.exports = userResource
