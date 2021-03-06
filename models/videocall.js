var mongoose = require('mongoose')
var connection = require('../services/connection')

var VideocallSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  sessionId: { type: String, required: true },
  datetime: { type: Date, required: true },
  startTime: { type: Date, required: false },
  endTime: { type: Date, required: false },
  // Array referencing the objectIds of participants in the call
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = connection.model('Videocall', VideocallSchema)
