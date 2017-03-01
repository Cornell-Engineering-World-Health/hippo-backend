var mongoose = require('mongoose')
var connection = require('../services/connection')
var autoIncrement = require('mongoose-auto-increment')

var UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },

  // Array referencing the userIds of contact
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Array referencing the chatNames of calls this user is participating in
  calls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Videocall' }]
})

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1
})

module.exports = connection.model('User', UserSchema)
