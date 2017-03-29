var CDR = require('../../models/cdr')

var testCdr1 = {
  connectionId: 'testId1',
  hasVideo: false,
  hasAudio: false,
  disconnectReason: ['goodDisconnect', 'networkFailure'],
  callDuration: 9000000000,
  destroyTime: '1970-04-26T17:46:40.000Z',
  creationTime: '1970-01-12T13:46:40.000Z',
  frameRate: 60,
  videoDimensions: {
    width: 1024,
    height: 768
  },
  videoType: 'camera',
  participantsId: [
    1,
    4
  ]
}
var testCdr2 = {
  connectionId: 'testId2',
  hasVideo: true,
  hasAudio: true,
  disconnectReason: ['goodDisconnect', 'goodDisconnect'],
  callDuration: 9000000000,
  destroyTime: '1970-04-26T17:46:40.000Z',
  creationTime: '1970-01-12T13:46:40.000Z',
  frameRate: 30,
  videoDimensions: {
    width: 1280,
    height: 1024
  },
  videoType: 'camera',
  participantsId: [
    1,
    3
  ]
}
var testCdr3 = {
  connectionId: 'testId3',
  hasVideo: true,
  hasAudio: true,
  disconnectReason: ['networkFailure', 'networkFailure'],
  callDuration: 999010,
  destroyTime: '1970-01-01T00:16:40.000Z',
  creationTime: '1970-01-01T00:00:00.990Z',
  videoType: 'screen',
  frameRate: 120,
  videoDimensions: {
    width: 800,
    height: 480
  },
  participantsId: [
    1
  ]
}

var newTestCdr = function (testCdr) {
  var newCdr = new CDR()
  newCdr.hasVideo = testCdr.hasVideo
  newCdr.disconnectReason = testCdr.disconnectReason
  newCdr.callDuration = testCdr.callDuration
  newCdr.destroyTime = testCdr.destroyTime
  newCdr.creationTime = testCdr.creationTime
  newCdr.participantsId = testCdr.participantsId

  return newCdr
}

var cdrResource = {
  testCdr1: testCdr1,
  testCdr2: testCdr2,
  testCdr3: testCdr3,
  newTestCdr: newTestCdr
}

module.exports = cdrResource
