/* eslint-env mocha */
require('dotenv').config()
var sinon = require('sinon')
// var chai = require('chai')
// var expect = chai.expect
var videoService = require('../../services/videos')

describe('Video Service', function () {
  describe('generateChatName', function () {
    it('should return a unique chat name', sinon.test(function () {
      //
      videoService.generateChatName()
    }))
  })
})
