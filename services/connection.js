require('dotenv').config()
var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')
var connection

// plug in q promise library
mongoose.Promise = require('q').Promise

// instantiate our connection
connection = mongoose.createConnection(process.env.DB_MONGODB_URL)

// initialize mongoose-auto-increment with our mongo connection
autoIncrement.initialize(connection)

module.exports = connection
