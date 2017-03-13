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
    ensureAuthenticatedSpy = sinon.stub(auth, 'ensureAuthenticated', function (res, req, next) {
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
  it('should create a User on /users POST', function (done) {
    chai.request(server)
      .post('/api/users')
      .send({
        firstName: 'Frank',
        lastName: 'Chan',
        email: 'frank.chan@company.com'
      })
      .end(function (err, res) {
        console.log(err)
        should.not.exist(err)
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('message')
        res.body.should.have.property('data')
        res.body.data.should.be.a('object')
        res.body.data.should.have.property('userId')
        res.body.data.should.have.property('firstName')
        res.body.data.should.have.property('lastName')
        res.body.data.should.have.property('email')
        res.body.data.should.have.property('_id')

        User.findOne({ userId: res.body.data.userId }, function (err, user) {
          should.not.exist(err)
          should.not.equal(user, null)
        })
        done()
      })
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
          res.body.should.have.property('_id')
          done()
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
