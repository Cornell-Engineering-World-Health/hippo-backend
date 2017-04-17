var schedule = require('node-schedule')
var Videocall = require('../models/videocall')
var moment = require('moment')

module.exports.start = function () {
  var rule = new schedule.RecurrenceRule()
  rule.hour = 23

  // prune calls on the 23rd hour of the day
  schedule.scheduleJob(rule, function () {
    var twelveHoursBefore = moment(Date.now()).subtract(12, 'hours').format()
    Videocall
    .remove({ endTime: { $lte: twelveHoursBefore } })
    .exec(function (err, calls) {
      if (err) {
        console.log(err)
      } else {
        console.log('Videocalls pruned: ' + calls.result.n)
      }
    })
  })
}
