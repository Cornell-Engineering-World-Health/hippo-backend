/* eslint-env mocha */
require('dotenv').config()
require('sinon-mongoose')
var sinon = require('sinon')
// var chai = require('chai')
// var expect = chai.expect
var videoService = require('../../services/videos')
var Videocall = require('../../models/videocall')

describe('Video Service', function () {
  describe('generateChatName', function () {
    it('should look for a new name since the current one is already used', function (done) {
      var mock = sinon.mock(Videocall)
      mock.expects('findOne').chain('exec').yields('SOME_VALUE', 'SOME_VALUE', null)
      videoService.generateChatName(function (err, name) { if (err) {} })
      mock.verify()
      done()
    })
  })
})
