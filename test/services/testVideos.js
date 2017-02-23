require('dotenv').config()
var mongoose = require('mongoose')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
var OpenTok = require('opentok')

var videoModel = require('../../models/videocall')
var video = require('../../services/videos')

describe("Video Service", function () {
  describe("createSession", function () {
    it("should create session and token", sinon.test(function () {
      var req = { body: { name: "testChat" } }
      var res = { json: function(param) { } }

      var save = sinon.stub(videoModel.prototype, 'save')
      var session = {
        generateToken: function () {
          return "testTokenId";
        },
        sessionId: "testSessionId"
      }
      var createSession = sinon.stub(OpenTok.prototype, 'createSession', function (callback) {
        callback(null, session)
      })

      save.yields(null)

      video.createSession(req, res)
    }))
  })

  describe("generateChatName", function () {
    it("should return a unique chat name", sinon.test(function() {
      // implement test
    }))
  })
})
