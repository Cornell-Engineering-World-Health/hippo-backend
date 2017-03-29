var mongoose = require('mongoose')
var connection = require('../services/connection')

var CallEventSchema = new mongoose.Schema({
  callId: { type: String, required: true },
  timestamp: { type: Date, required: true },
  eventType: { type: Object, required: true },
  userId: { type: Number, required: true }
})

module.exports = connection.model('CallEvent', CallEventSchema)

