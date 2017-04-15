var schedule = require('node-schedule')
var Videocall = require('../models/videocall')
var moment = require('moment')

module.exports.start = function () {
  var rule = new schedule.RecurrenceRule()
  rule.hour = 23

  var pruneCalls = schedule.scheduleJob(rule, function () {
    var twelveHoursBefore = moment(Date.now()).subtract(12, 'hours').format()
    Videocall
    .remove({ endTime: { $lte: twelveHoursBefore }})
    .exec(function (err, calls) {
      console.log('Videocalls pruned: ' + calls.result.n)
    })
  })
}
