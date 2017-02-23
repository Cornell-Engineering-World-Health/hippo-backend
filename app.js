require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')

var app = express()

// initialize swagger-jsdoc
var swaggerSpec = require('./swagger/swagger.js')

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

mongoose.connect(process.env.DB_MONGODB_URL)

app.use(bodyParser.urlencoded({
  extended: true
}))

var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

var router = express.Router()

router.use('/videos', require('./routes/videos.js'))

router.get('/', function (req, res) {
  res.json({ message: 'API' })
})

app.use('/api', router)

// Start the server
app.listen(port)

console.log('Server running on port ' + port)
