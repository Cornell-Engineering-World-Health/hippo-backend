# hippo-backend
[![Build Status](https://travis-ci.org/Cornell-Engineering-World-Health/hippo-backend.svg?branch=master)](https://travis-ci.org/Cornell-Engineering-World-Health/hippo-backend) 

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

The backend REST API for hippo, a HIPAA-compliant video conferencing system. Built with OpenTok, NodeJS, MongoDB, Mongoose, Socket.io, and Google OAth. 

Features include:
* HIPAA-certified sessions through OpenTok
* User authentication with Google OAth
* Real-time notifications using Socket.io
* Create and Store secure video sessions with MongoDB, Mongoose
* Call Detail Record protocol
* Client-Agnostic API

See our web frontend interface, [hippo-frontend](https://github.com/Cornell-Engineering-World-Health/hippo-frontend)

See our Android frontend application, [hippo-android](https://github.com/Cornell-Engineering-World-Health/hippo-android).

View our live deployment of the web interface at https://aqueous-stream-90183.herokuapp.com.

Learn more about our team, [Cornell Engineering World Health](https://ewh.engineering.cornell.edu/).

For local deployment, follow these instructions:

## Setup
Generate OpenTok API and SECRET keys at https://tokbox.com by creating a new project in your account.

1. Clone this repository
2. Run `npm install && npm run setup`
3. Import your OpenTok API and SECRET keys into .env file
4. Set up Google OAuth as follows

## Google OAuth
Setting up the web application to support Google logins
#### Developer Console
1. Go to your [Google Developer's Console](https://console.developers.google.com/apis/credentials)
2. Create a new project if you have not already for hippo and select it
3. Go to **Credentials** tab on the left and click **Create Credentials > OAuth Client ID**
4. Select **Web Application**
5. For Authorized Javascript Origins, put http://localhost:3000
6. For Authorized Redirect URIS, put http://localhost:3000/auth/google/callback
7. Note that steps 5 and 6 are for local development only. Modify these for deployments as you see fit.
#### Additional Help
More information about authentication using Google OAuth can be found [here](https://developers.google.com/identity/protocols/OAuth2)

## Swagger Documentation
swagger docs local route: localhost:3000/api-docs/
