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
        res.body.data.should.be.a('object')
        res.body.data.should.have.property('tokenId')
        res.body.data.should.have.property('sessionId')
        res.body.data.should.have.property('name')
        res.body.data.should.have.property('_id')

        res.body.data.name.should.equal('TestChatName')
        done()
      })
  })
  it('should get a SINGLE session on /videos/:video_name GET', function (done) {
    var video = new Videocall()
    video.name = 'TestChatName'
    video.sessionId = 'TestSessionId'
    video.tokenId = 'TestTokenId'

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
          res.body.should.have.property('tokenId')
          res.body.should.have.property('_id')
          res.body.name.should.equal(data.name)
          res.body.sessionId.should.equal(data.sessionId)
          res.body.tokenId.should.equal(data.tokenId)
          res.body._id.should.equal(data.id)
          done()
        })
    })
  })
})
