var User = require('../models/user')

exports.addCall = function (id, call, callback) {
  User.update(
    { userId: id },
    { $push: { calls: call } },
    callback
  )
}
