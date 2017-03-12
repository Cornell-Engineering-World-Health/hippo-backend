 var swaggerJSDoc = require('swagger-jsdoc')

// swagger definition
var swaggerDefinition = {
  swagger: '2.0',
  info: {
    title: 'Hippo-Backend',
    version: '1.0.0',
    description: 'Backend REST API and server handling hippo request and functions.',
    contact: {
      name: 'Cornell Engineering World Health',
      url: 'https://ewh.engineering.cornell.edu/contact.html',
      email: 'ewhcornell@gmail.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  host: process.env.BASE_URL,
  basePath: '/api',
  definitions: {
    'newSession': {
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
            'sessionId': {
              'type': 'string'
            },
            'name': {
              'type': 'string'
            },
            '_id': {
              'type': 'string'
            },
            'tokenId': {
              'type': 'string'
            }
          }
        }
      }
    },
    'Error': {
      'properties': {
        'code': {
          'type': 'string'
        },
        'detail': {
          'type': 'string'
        }
      }
    },
    'SessionWithToken': {
      'properties': {
        '_id': {
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
        },
        'tokenId': {
          'type': 'string'
        }
      }
    },
    'Session': {
      'properties': {
        '_id': {
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
    'User': {
      'required': ['firstName', 'lastName', 'email'],
      'properties': {
        'firstName': {
          'type': 'string'
        },
        'lastName': {
          'type': 'string'
        },
        'email': {
          'type': 'string'
        }
      }
    },
    'UserResponse': {
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
            'userId': {
              'type': 'integer'
            },
            'firstName': {
              'type': 'string'
            },
            'lastName': {
              'type': 'string'
            },
            'email': {
              'type': 'string'
            },
            '_id': {
              'type': 'string'
            }
          }
        }
      }
    },
    'deleteResponse': {
      'properties': {
        'message': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'cdrInfo': {
          'type': 'object',
          'properties': {
            '_v': {
              'type': 'integer'
            },
            'hasVideo': {
              'type': 'boolean'
            },
            'disconnectReason': {
              'type': 'string'
            },
            'callDuration':{
              'type':'number'
            },
            'destroyTime': {
              'type': 'string'
            },
            'creationTime': {
              'type': 'string'
            },
            '_id': {
              'type': 'string'
            },
            'participantsId': {
              'type': 'integer'
            }
          }
        }
      }
    },
    'CDR': {
      'required': ['creationTime', 'destroyTime', 'disconnectReason', 'hasVideo', 'participantsId'],
      'properties': {
        'creationTime': {
          'type': 'integer'
        },
        'destroyTime': {
          'type': 'integer'
        },
        'disconnectReason': {
          'type': 'string'
        },
        'hasVideo': {
          'type': 'boolean'
        },
        'participantsId': {
          'type': 'array',
          'items': {
            'type': 'integer'
          }
        }
      }
    },
    'CdrResponse': {
      'properties': {
        '_id': {
          'type': 'string'
        },
        'hasVideo': {
          'type': 'boolean'
        },
        'disconnectReason': {
          'type': 'string'
        },
        'callDuration': {
          'type': 'integer'
        },
        'destroyTime': {
          'type': 'string'
        },
        'creationTime': {
          'type': 'string'
        },
        '_v': {
          'type': 'integer'
        },
        'participantsId': {
          'type': 'array',
          'items': {
            'type': 'integer'
          }
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
  apis: ['./routes/*.js']
}

module.exports = swaggerJSDoc(options)
