var mongoose = require('mongoose')
var connection = require('../services/connection')

var CDRSchema = new mongoose.Schema({
  creationTime: { type: Date, required: true },
  destroyTime: { type: Date, required: true },
  callDuration: { type: Number, required: true },
  disconnectReason: { type: String, required: true },
  hasVideo: { type: Boolean, required: true },
  //data: { type: String, required: true },
  participantsId: [{type: Number, required: true}]
})

module.exports = connection.model('CDR', CDRSchema)