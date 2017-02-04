var mongoose = require('mongoose');

var VideocallSchema = new mongoose.Schema({
  name: String,
  sessionId: String,
  tokenId: String
});

module.exports = mongoose.model('Videocall', VideocallSchema);
