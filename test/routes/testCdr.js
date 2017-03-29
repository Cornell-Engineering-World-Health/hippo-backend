/* eslint-env mocha */
require('dotenv').config()
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var CDR = require('../../models/cdr')
var CdrsResource = require('../resources/cdrsResource')
var server = require('../../app')
chai.use(chaiHttp)

describe('CDRs', function () {
  afterEach(function (done) {
    CDR.find({}).remove(function () {
      done()
    })
  })
  after(function (done) {
    CDR.find({}).remove(function () {
      done()
    })
  })
  it('should get ALL sessions on /cdrs GET', function (done) {
    var cdr1 = CdrsResource.newTestCdr(CdrsResource.testCdr1)
    var cdr2 = CdrsResource.newTestCdr(CdrsResource.testCdr2)
    var cdr3 = CdrsResource.newTestCdr(CdrsResource.testCdr3)
    cdr1.save(function (err, cdr1) {
      should.not.exist(err)
      cdr2.save(function (err, cdr2) {
        should.not.exist(err)
        cdr3.save(function (err, cdr3) {
          should.not.exist(err)
          chai.request(server)
            .get('/api/cdrs')
            .end(function (err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.should.be.json
              res.body.should.be.an('array')
              res.body.length.should.equal(3)
            })
          chai.request(server)
              .get('/api/cdrs?connectionId=testId1')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(1)
                res.body[0].should.have.property('connectionId')
                res.body[0].videoType.should.equal('testId1')
              })
          chai.request(server)
              .get('/api/cdrs?hasVideo=true')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(2)
                res.body[0].should.have.property('hasVideo')
                res.body[0].videoType.should.equal(true)
              })
          chai.request(server)
              .get('/api/cdrs?hasVideo=false')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(1)
                res.body[0].should.have.property('hasVideo')
                res.body[0].videoType.should.equal(false)
              })
          chai.request(server)
              .get('/api/cdrs?hasAudio=true')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(2)
                res.body[0].should.have.property('hasAudio')
                res.body[0].videoType.should.equal(true)
              })
          chai.request(server)
              .get('/api/cdrs?hasAudio=false')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(1)
                res.body[0].should.have.property('hasAudio')
                res.body[0].videoType.should.equal(false)
              })
          chai.request(server)
              .get('/api/cdrs?frameRate=60')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(1)
                res.body[0].should.have.property('frameRate')
                res.body[0].videoType.should.equal(60)
              })
          chai.request(server)
              .get('/api/cdrs?frameRate=120')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(1)
                res.body[0].should.have.property('frameRate')
                res.body[0].videoType.should.equal(120)
              })
          chai.request(server)
              .get('/api/cdrs?videoType=camera')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(2)
                res.body[0].should.have.property('videoType')
                res.body[0].videoType.should.equal('camera')
              })
          chai.request(server)
              .get('/api/cdrs?videoType=screen')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(1)
                res.body[0].should.have.property('videoType')
                res.body[0].videoType.should.equal('screen')
              })
          chai.request(server)
              .get('/api/cdrs?creationTime=1970-01-01')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(3)
                res.body[0].should.have.property('creationTime')
              })
          chai.request(server)
              .get('/api/cdrs?creationTime=1970-01-12')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(2)
                res.body[0].should.have.property('creationTime')
                res.body[0].craetionTime.should.be.at.least('1970-01-12')
              })
          chai.request(server)
              .get('/api/cdrs?creationTime=1970-09')
              .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.an('array')
                res.body.length.should.equal(0)
              })
        })
      })
    })
  })
})
