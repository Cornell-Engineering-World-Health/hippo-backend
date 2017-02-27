/* eslint-env mocha */
require('dotenv').config()
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var Videocall = require('../../models/videocall')

var server = require('../../app')
chai.use(chaiHttp)

describe('Videos', function () {
  afterEach(function (done) {
    Videocall.collection.drop()
    done()
  })

  it('should create and add a SINGLE session on /videos POST', function (done) {
    chai.request(server)
      .post('/api/videos')
      .send({ 'name': 'TestChatName' })
      .end(function (err, res) {
        should.not.exist(err)
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('data')
        res.body.should.have.property('tokenId')
        res.body.data.should.be.a('object')
        res.body.data.should.have.property('sessionId')
        res.body.data.should.have.property('name')
        res.body.data.should.have.property('_id')
        res.body.data.name.should.equal('TestChatName')

        Videocall.findOne({ name: 'TestChatName' }, function (err, video) {
          should.not.exist(err)
          should.not.equal(video, null)
        })
        done()
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

      video.save(function (err, data) {
        should.not.exist(err)
        chai.request(server)
          .get('/api/videos/' + data.name)
          .end(function (err, res) {
            should.not.exist(err)
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('object')
            res.body.should.have.property('data')
            res.body.should.have.property('tokenId')
            res.body.data.should.be.a('object')
            res.body.data.should.have.property('name')
            res.body.data.should.have.property('sessionId')
            res.body.data.should.have.property('_id')
            res.body.data.name.should.equal(data.name)
            res.body.data.sessionId.should.equal(data.sessionId)
            res.body.data._id.should.equal(data.id)
            done()
          })
      })
    })
  })
})
