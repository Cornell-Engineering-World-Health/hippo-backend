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
    it('should return a unique chat name', sinon.test(function () {
      sinon.mock(Videocall)
        .expects('findOne')
        .chain('exec')
        .yields(null, null)
      videoService.generateChatName()
    }))
  })
})
