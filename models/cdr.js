var mongoose = require('mongoose')
var connection = require('../services/connection')

var CDRSchema = new mongoose.Schema({
  connectionId: { type: String, required: true },
  creationTime: {type: Date, required: true},
  destroyTime: { type: Date, required: true },
  callDuration: { type: Number, required: true },
  disconnectReason: [{ type: String, required: true }],
  hasVideo: { type: Boolean, required: true },
  hasAudio: { type: Boolean, required: true },
  frameRate: { type: Number, required: true },
  videoDimensions: { type: Object, required: true },
  videoType: { type: String, required: true },
  // data: { type: String, required: true },
  participantsId: [{ type: Number, required: true }]
})

module.exports = connection.model('CDR', CDRSchema)
