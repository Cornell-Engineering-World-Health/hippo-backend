/**
* makeCdr.js contains functions used to construct CDR JSONs from events in database
*/

var CallEvent = require('../models/callEvent')
var Q = require('q')

/**
* helper function that returns a promise, which when resolved, returns
* a Call Detail Record JSON for the given session name: callId
*/
var makeCdr = function makeCdr (callId) {
  return new Promise(function (resolve, reject) {
    CallEvent.find({ callId: callId }, function (err, events) {
      if (err) {
        reject('INTERNAL_READ')
      } else if (events.length === 0) {
        reject('CALL_NOT_FOUND')
      } else {
        var cdr = {}
        cdr.sessionName = events[0].callId
        cdr.creationTime = events[0].timestamp
        cdr.destroyTime = events[events.length - 1].timestamp
        cdr.callDuration = cdr.destroyTime.getTime() - cdr.creationTime.getTime()
        cdr.connections = []
        cdr.disconnections = []
        cdr.userIds = []

        cdr.streamCreations = []
        cdr.frameRates = []
        cdr.hasAudios = []
        cdr.hasVideos = []
        cdr.videoTypes = []

        var k = 0
        while (k < events.length) {
          if (events[k].eventType.event === 'connectionCreated') {
            cdr.connections.push('' + events[k].eventType.connectionId + ', ' + events[k].userId + ', ' + events[k].timestamp)
            var match = false
            for (var id in cdr.userIds) {
              if (events[k].userId === id) {
                match = true
              }
            }
            if (!match) {
              cdr.userIds.push(events[k].userId)
            }
          } else if (events[k].eventType.event === 'sessionDisconnected') {
            cdr.disconnections.push('' + events[k].userId + ', ' + events[k].eventType.reason + ', ' + events[k].timestamp)
          } else if (events[k].eventType.event === 'streamCreated') {
            cdr.streamCreations.push('' + events[k].userId + ', ' + events[k].timestamp)
          } else if (events[k].eventType.event === 'frameRate') {
            cdr.frameRates.push('' + events[k].userId + ', ' + events[k].eventType.frameRate + ', ' + events[k].timestamp)
          } else if (events[k].eventType.event === 'hasAudio') {
            cdr.hasAudios.push('' + events[k].userId + ', ' + events[k].eventType.hasAudio + ', ' + events[k].timestamp)
          } else if (events[k].eventType.event === 'hasVideo') {
            cdr.hasVideos.push('' + events[k].userId + ', ' + events[k].eventType.hasVideo + ', ' + events[k].timestamp)
          } else if (events[k].eventType.event === 'videoType') {
            cdr.videoTypes.push('' + events[k].userId + ', ' + events[k].eventType.videoType + ', ' + events[k].timestamp)
          }
          k++
        }

        resolve(cdr)
      }
    })
  })
}

/**
* getOneCdr generates a CDR for the given session name: callId
* Runs callback(err, cdr). err is a string of the error thrown and cdrs
* is a Call Detail Record JSON.
*/
exports.getOneCdr = function getOneCdr (callId, callback) {
  makeCdr(callId).then(function (cdr) {
    callback('', cdr)
  }).catch(function (err) {
    callback(err, null)
  })
}

/**
* getAllCdrs finds all events of the user's ID: 'userId' and generates a CDR for each unique
* session name/callId. Runs callback(err, cdrs). err is a string of the error thrown and cdrs
* is an array of Call Detail Record JSON.
*/
exports.getAllCdrs = function getAllCdrs (userId, callback) {
  CallEvent.find({ userId: userId }, function (err, events) {
    if (err) {
      callback('INTERNAL_READ', null)
    } else if (events.length === 0) {
      callback('USER_NOT_FOUND', null)
    } else {
      var callIds = []
      for (var j = 0; j < events.length; j++) {
        var match = false
        var k = 0
        while (!match && k < callIds.length) {
          if (events[j].callId === callIds[k]) {
            match = true
          }
          k++
        }
        if (!match) {
          callIds.push(events[j].callId)
        }
      }
      var promises = []
      for (var i of callIds) {
        promises.push(makeCdr(i))
      }
      Q.all(promises).then(function (cdrs) {
        callback('', cdrs)
      }).catch(function (err) {
        callback(err, null)
      })
    }
  })
}
