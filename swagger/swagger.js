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
   securityDefinition: {
     bearer: {
       type: 'apiKey',
       name: 'Authorization',
       in: 'header'
     }
   },
   definitions: {
     'SessionWithToken': {
       'required': ['_id', 'tokenId', 'sessionId', 'name', '_v'],
       'type': 'object',
       'properties': {
         'sessionId': {
           'type': 'string'
         },
         'name': {
           'type': 'string'
         },
         'tokenId': {
           'type': 'string'
         },
         'startTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'endTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'datetime': {
           'type': 'string',
           'format': 'date-time'
         },
         'participants': {
           'type': 'array',
           'items': {
             '$ref': 'UserResponse'
           }
         }
       }
     },
     'SessionName': {
       'required': ['name'],
       'properties': {
         'name': {
           'type': 'string'
         }
       }
     },
     'Session': {
       'required': ['tokenId', 'sessionId', 'name'],
       'properties': {
         'sessionId': {
           'type': 'string'
         },
         'name': {
           'type': 'string'
         },
         'tokenId': {
           'type': 'string'
         },
         'startTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'endTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'participants': {
           'type': 'array',
           'items': {
             '$ref': 'UserResponse'
           }
         }
       }
     },
     'SessionParams': {
       'properties': {
         'invitedUserIds': {
           'type': 'array',
           'items': {
             'type': 'integer'
           }
         },
         'startTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'endTime': {
           'type': 'string',
           'format': 'date-time'
         }
       }
     },
     'newSession': {
       'required': ['message', 'data'],
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
             },
             'startTime': {
               'type': 'string',
               'format': 'date-time'
             },
             'endTime': {
               'type': 'string',
               'format': 'date-time'
             },
             'datetime': {
               'type': 'string',
               'format': 'date-time'
             },
             'participants': {
               'type': 'array',
               'items': {
                 '$ref': 'UserResponse'
               }
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
     'SelfResponse': {
       'properties': {
         'data': {
           'type': 'object',
           'properties': {
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
             'picture': {
               'type': 'string'
             },
             'contacts': {
               'type': 'array',
               'items': {
                 'type': 'string'
               }
             },
             'google': {
               'type': 'object'
             },
             'calls': {
               'type': 'array',
               'items': {
                 'type': 'object'
               }
             }
           }
         }
       }
     },
     'UserResponse': {
       'properties': {
         'data': {
           'type': 'object',
           'properties': {
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
             'picture': {
               'type': 'string'
             }
           }
         }
       }
     },
     'UserListResponse': {
       'properties': {
         'users': {
           'type': 'array',
           'items': {
             '$ref': 'UserResponse'
           }
         }
       }
     },
     'deleteSuccessMessage': {
       'required': ['message', 'name'],
       'properties': {
         'message': {
           'type': 'string'
         },
         'name': {
           'type': 'string'
         }
       }
     },
     'CDR': {
       'properties': {
         'sessionName': {
           'type': 'string'
         },
         'creationTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'destroyTime': {
           'type': 'string',
           'format': 'date-time'
         },
         'callDuration': {
           'type': 'number'
         },
         'connections': {
           'type': 'array',
           'items': {
             'type': 'string'
           }
         },
         'disconnections': {
           'type': 'array',
           'items': {
             'type': 'string'
           }
         },
         'userIds': {
           'type': 'array',
           'items': {
             'type': 'integer'
           }
         },
         'streamCreations': {
           'type': 'array',
           'items': {
             'type': 'string'
           }
         },
         'frameRates': {
           'type': 'array',
           'items': {
             'type': 'string'
           }
         },
         'hasAudio': {
           'type': 'array',
           'items': {
             'type': 'string'
           }
         },
         'hasVideo': {
           'type': 'array',
           'items': {
             'type': 'string'
           }
         },
         'videoTypes': {
           'type': 'array',
           'items': {
             'type': 'string'
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
