require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

var app = express()

// initialize swagger-jsdoc
var swaggerSpec = require('./swagger/swagger.js')

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PATCH, POST, GET, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

var router = express.Router()

router.use('/videos', require('./routes/videos.js'))
router.use('/users', require('./routes/users.js'))

router.get('/', function (req, res) {
  res.json({ message: 'API' })
})

app.use('/api', router)

// Start the server
app.listen(port)

console.log('Server running on port ' + port)

module.exports = app
