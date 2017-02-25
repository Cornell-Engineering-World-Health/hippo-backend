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
  basePath: '/api',
  definitions: {
    'newSession': {
      'required': ['message'],
      'properties': {
        'message': {
          'type': 'string'
        },
        'data': {
          'type': 'object',
          'properties': {
            '_v': {
              'type': 'integer'
            },
            'tokenId': {
              'type': 'string'
            },
            'sessionId': {
              'type': 'string'
            },
            'name': {
              'type': 'string'
            },
            '_id': {
              'type': 'string'
            }
          }
        }
      }
    },
    'Error': {
      'required': ['code', 'detail'],
      'properties': {
        'code': {
          'type': 'string'
        },
        'detail': {
          'type': 'string'
        }
      }
    },
    'Session': {
      'required': ['_id', 'tokenId', 'sessionId', 'name', '_v'],
      'properties': {
        '_id': {
          'type': 'string'
        },
        'tokenId': {
          'type': 'string'
        },
        'sessionId': {
            'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        '_v': {
          'type': 'integer'
        }
      }
    },  
    'SessionName':{
      'required': ['name'],
      'properties': {
        'name': {
          'type': 'string'
        }
      }
    }
  }
}

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
}

module.exports = swaggerJSDoc(options)
