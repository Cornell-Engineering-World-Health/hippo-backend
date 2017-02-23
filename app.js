require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')
var swaggerJSDoc = require('swagger-jsdoc')

var app = express()

// swagger definition
var swaggerDefinition = {
  swagger: '2.0',
  info: {
    title: 'Hippo-Backend',
    version: '1.0.0',
    description: 'Backend REST API and server handling hippo request and functions.',
    contact: {
      name: "Cornell Engineering World Health",
      url: "https://ewh.engineering.cornell.edu/contact.html",
      email: "ewhcornell.gmail.com"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    },
  },
  host: process.env.BASE_URL,
  basePath: '/api',
  
}

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
}

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options)

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
