var swaggerJSDoc = require('swagger-jsdoc')

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
  basePath: '/',

}

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
}

module.exports = swaggerJSDoc(options)
