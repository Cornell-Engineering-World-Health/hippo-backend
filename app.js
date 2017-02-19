require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')

var app = express()

mongoose.connect(process.env.DB_MONGODB_URL)

app.use(bodyParser.urlencoded({
  extended: true
}))

var port = process.env.PORT || 3000

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
