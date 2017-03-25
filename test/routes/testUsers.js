/* eslint-env mocha */
require('dotenv').config()
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var User = require('../../models/user')
var UsersResource = require('../resources/usersResource')
var sinon = require('sinon')
chai.use(chaiHttp)

describe('Users', function () {
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
  it('should get a SINGLE User on /users/:user_id GET', function (done) {
    var testUser = UsersResource.newTestUser(UsersResource.testUser1)
    testUser.save(function (err, data) {
      should.not.exist(err)
      chai.request(server)
        .get('/api/users/' + data.userId)
        .end(function (err, res) {
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('userId')
          res.body.should.have.property('firstName')
          res.body.should.have.property('lastName')
          res.body.should.have.property('email')
          done()
        })
    })
  })
  it('should get ALL Users on /users GET', function (done) {
    var testUser = UsersResource.newTestUser(UsersResource.testUser1)
    var testUser2 = UsersResource.newTestUser(UsersResource.testUser2)
    testUser.save(function (err, data) {
      should.not.exist(err)
      testUser2.save(function (err, data) {
        should.not.exist(err)
        chai.request(server)
          .get('/api/users/')
          .end(function (err, res) {
            should.not.exist(err)
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('object')
            res.body.should.have.property('users')
            res.body.users.length.should.equal(2)
            res.body.users[0].should.have.property('userId')
            res.body.users[0].should.have.property('firstName')
            res.body.users[0].should.have.property('lastName')
            res.body.users[0].should.have.property('email')
            done()
          })
      })
    })
  })
  it('should return 404 Not found when User with userID not found on /users/:user_id GET', function (done) {
    chai.request(server)
      .get('/api/users/99999')
      .end(function (err, res) {
        should.exist(err)
        res.should.have.status(404)
        done()
      })
  })
})
