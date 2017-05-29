# hippo-backend
[![Build Status](https://travis-ci.org/Cornell-Engineering-World-Health/hippo-backend.svg?branch=master)](https://travis-ci.org/Cornell-Engineering-World-Health/hippo-backend) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

HIPAA compliant REST API for creating and managing video sessions.

## Setup
* clone this repository
* run `npm install && npm run setup`
* import Opentok API and SECRET keys into .env file
* Set up Google OAuth as follows

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
