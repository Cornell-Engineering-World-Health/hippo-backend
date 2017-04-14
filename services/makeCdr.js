var CallEvent = require('../models/callEvent')
var Errors = require('../resources/errors')
var Q = require('q')
var cdrs=[]


var makeCdr = function makeCdr(callId){
	CallEvent.find({ callId: callId }, function (err, events) {
    if (err) {
		return new Promise(function(resolve, reject){
	    	reject();
	    })
    }
    else if (events.length === 0) {
		return new Promise(function(resolve, reject){
	    	reject();
	    })
    }
    else{
    	var cdr = {}
	    cdr.sessionName = events[0].callId
	    cdr.creationTime = events[0].timestamp
	    cdr.destroyTime = events[events.length - 1].timestamp
	    cdr.callDuration = cdr.destroyTime.getTime() - cdr.creationTime.getTime()
	    cdr.connections = []
	    // cdr.disconnections=[]
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
	   	return new Promise(function(resolve, reject){
	    	cdrs.push(cdr)
	    	resolve();
	    })
	}
	})
}

exports.makeCdr = makeCdr

exports.makeMultipleCdrs = function makeMultipleCdrs(userId, callback) {
	CallEvent.find({ userId: userId }, function (err, events) {
	    if (err) {
	      callback("INTERNAL_READ", null)
	    }
	    else if (events.length === 0) {
	      callback("USER_NOT_FOUND", null)
	    }
	    else{
		    var callIds = [];
		    for(var j=0;j<events.length; j++){
		      var match=false
		      var k =0;
		      while(!match && k<callIds.length){
		        if(events[j].callId === callIds[k]){
		          match=true
		        }
		        k++;
		      }
		      if(!match){
		        callIds.push(events[j].callId)
		      }
		    }
		    var promises=[]
	        for (var i of callIds) {
				promises.push(function(){return makeCdr(i)})
	        }
		    console.log(promises)
		    Q.all(promises).then(function(){
		    	console.log("done")
		    }).catch(function(){
		    	console.log("error")
		    })
	    }
	 })
