/* eslint-env mocha */
require('dotenv').config()
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var User = require('../../models/user')
var UsersResource = require('../resources/usersResource')
var sinon = require('sinon')
chai.use(chaiHttp)

describe('Self', function () {
  var server
  var auth
  var ensureAuthenticatedSpy

  before(function (done) {
    auth = require('../../services/auth')
    ensureAuthenticatedSpy = sinon.stub(auth, 'ensureAuthenticated', function (req, res, next) {
      req.user = UsersResource.newTestUser(UsersResource.testUser3)
      return next()
    })
    server = require('../../app')

    User.find({}).remove(function () {
      done()
    })
  })
  afterEach(function (done) {
    User.find({}).remove(function () {
      done()
    })
  })
  after(function (done) {
    ensureAuthenticatedSpy.restore()
    done()
  })
  it('should get a SINGLE User on /self GET', function (done) {
    var testUser = UsersResource.newTestUser(UsersResource.testUser3)
    testUser.save(function (err, data) {
      should.not.exist(err)
      chai.request(server)
        .get('/api/self')
        .end(function (err, res) {
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('userId')
          res.body.should.have.property('firstName')
          res.body.should.have.property('lastName')
          res.body.should.have.property('email')
          res.body.should.have.property('_id')
          done()
        })
    })
  })
})
