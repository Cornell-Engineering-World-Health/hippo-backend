require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

var path = require('path')

var app = express()
// var http = require('http').Server(app)
// var io = require('socket.io')(http)
// var socketio = require('./services/socketio.js')(io)

var auth = require('./services/auth')

// initialize swagger-jsdoc
var swaggerSpec = require('./swagger/swagger.js')

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.options('*', cors())
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

var router = express.Router()

router.use(auth.ensureAuthenticated)

router.use('/videos', require('./routes/videos.js'))
// app.post('/videos', socketService)
router.use('/users', require('./routes/users.js'))
router.use('/self', require('./routes/self.js'))

router.get('/', function (req, res) {
  res.json({ message: 'API' })
})

app.use('/auth', require('./routes/auth.js'))
app.use('/api', router)
app.use('/swagger', require('./routes/swagger.js'))

// Start the server
var io = require('socket.io').listen(app.listen(port))
var socketService = require('./services/socketService')(io)
app.set('socketService', socketService)

console.log('Server running on port ' + port)

module.exports = app
