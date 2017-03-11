var mongoose = require('mongoose')

var CdrSchema = new mongoose.Schema({
  creationTime: { type: Date, required: true },
  destroyTime: { type: Date, required: true },
  callDuration: { type: Number, required: true },
  disconnectReason: { type: String, required: true },
  hasVideo: { type: Boolean, required: true },
  //data: { type: String, required: true },
  participants: {type: Array, required: true}
})

module.exports = mongoose.model('Cdr', CdrSchema)