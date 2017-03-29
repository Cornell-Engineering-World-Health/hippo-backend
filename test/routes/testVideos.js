/* eslint-env mocha */
require('dotenv').config()
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var Videocall = require('../../models/videocall')
var User = require('../../models/user')
var UsersResource = require('../resources/usersResource')
var moment = require('moment')
var sinon = require('sinon')
chai.use(chaiHttp)

describe('Videos', function () {
  var server
  var auth
  var ensureAuthenticatedSpy
  var globalTestUser = UsersResource.newTestUser(UsersResource.testUser3)

  before(function (done) {
    auth = require('../../services/auth')
    ensureAuthenticatedSpy = sinon.stub(auth, 'ensureAuthenticated', function (req, res, next) {
      req.user = globalTestUser
      return next()
    })
    server = require('../../app')
    done()
  })
  afterEach(function (done) {
    Videocall.find({}).remove(function () {
      // User.find({}).remove(function () {
      done()
      // })
    })
  })
  after(function (done) {
    User.find({}).remove(function () {
      ensureAuthenticatedSpy.restore()
      done()
    })
  })
  it('should create and add a SINGLE session on /videos POST', function (done) {
    globalTestUser.save(function (err, user) {
      should.not.exist(err)
      chai.request(server)
        .post('/api/videos')
        .end(function (err, res) {
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          res.body.data.should.be.a('object')
          res.body.data.should.have.property('tokenId')
          res.body.data.should.have.property('sessionId')
          res.body.data.should.have.property('datetime')
          res.body.data.should.have.property('name')
          res.body.data.should.have.property('startTime')
          res.body.data.should.have.property('endTime')
          res.body.data.should.have.property('_id')
          res.body.data.should.have.property('participants')
          var chatName = res.body.data.name
          Videocall.findOne({ name: chatName }, function (err, video) {
            should.not.exist(err)
            should.not.equal(video, null)
          })
          done()
        })
    })
  })
  it('should return 404 Not found when attempting to create invalid call on /videos/:caller_id/users/:calling_id POST', function (done) {
    chai.request(server)
      .post('/api/videos')
      .send({ 'invitedUserIds': [43142] })
      .end(function (err, res) {
        should.exist(err)
        res.should.have.status(404)
        res.should.be.json
        done()
      })
  })
  it('should get ALL sessions on /videos GET', function (done) {
    chai.request(server)
      .get('/api/videos')
      .end(function (err, res) {
        should.not.exist(err)
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.an('array')
        res.body.length.should.equal(0)

        var OpenTok = require('opentok')
        var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
        opentok.createSession(function (err, session) {
          should.not.exist(err)
          var video = new Videocall()
          video.name = 'TestChatName'
          video.sessionId = session.sessionId
          video.datetime = Date.now()
          video.startTime = Date.now()
          video.endTime = Date.now()
          video.participants = []

          video.save(function (err, data) {
            should.not.exist(err)
            chai.request(server)
              .get('/api/videos')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body[0].should.be.a('object')
                res.body[0].should.have.property('startTime')
                res.body[0].should.have.property('endTime')
                res.body[0].should.have.property('_id')
                res.body[0].should.have.property('datetime')
                res.body[0].should.have.property('sessionId')
                res.body[0].should.have.property('name')
                res.body[0].name.should.equal(data.name)
                res.body.length.should.equal(1)
                done()
              })
          })
        })
      })
  })
  it('should get a SINGLE session on /videos/:video_name GET', function (done) {
    var OpenTok = require('opentok')
    var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)
    opentok.createSession(function (err, session) {
      should.not.exist(err)

      var video = new Videocall()
      video.name = 'TestChatName'
      video.sessionId = session.sessionId
      video.startTime = Date.now()
      video.endTime = moment(Date.now()).add(1, 'hours').format()
      video.datetime = Date.now()
      video.participants = [globalTestUser._id]

      video.save(function (err, data) {
        should.not.exist(err)
        chai.request(server)
            .get('/api/videos/' + data.name)
            .end(function (err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.should.be.json
              res.body.should.be.a('object')
              res.body.should.have.property('name')
              res.body.should.have.property('sessionId')
              res.body.should.have.property('_id')
              res.body.should.have.property('tokenId')
              res.body.name.should.equal(data.name)
              res.body.sessionId.should.equal(data.sessionId)
              res.body.should.have.property('participants')
              res.body.participants.length.should.equal(1)
              res.body._id.should.equal(data.id)
              done()
            })
      })
    })
  })
  it('should delete a SINGLE session on /videos/:video_name DELETE', function (done) {
    var video = new Videocall()
    video.name = 'TestChatName'
    video.sessionId = 'TestSessionId'
    video.tokenId = 'TestTokenId'
    video.datetime = Date.now()
    video.participants = []

    video.save(function (err, data) {
      should.not.exist(err)
      chai.request(server)
        .delete('/api/videos/' + data.name)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.should.have.property('name')
          res.body.name.should.equal(data.name)

          Videocall.findOne({ name: data.name }, function (err, video) {
            should.not.exist(err)
            should.equal(video, null)
          })
          done()
        })
    })
  })
  it('should not send an error for Not Found on /videos/:video_name DELETE', function (done) {
    var data = { name: 'NotFoundName' }
    Videocall.findOne({ name: data.name }, function (err, video) {
      should.not.exist(err)
      should.equal(video, null)
      chai.request(server)
        .delete('/api/videos/' + data.name)
        .end(function (err, res) {
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.should.have.property('name')
          res.body.name.should.equal(data.name)

          Videocall.findOne({ name: data.name }, function (err, video) {
            should.not.exist(err)
            should.equal(video, null)
          })
          done()
        })
    })
  })
})
