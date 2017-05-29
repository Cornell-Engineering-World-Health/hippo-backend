# hippo-backend
[![Build Status](https://travis-ci.org/Cornell-Engineering-World-Health/hippo-backend.svg?branch=master)](https://travis-ci.org/Cornell-Engineering-World-Health/hippo-backend) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

HIPAA compliant REST API for creating and managing video sessions.

## Setup
* clone this repository
* run npm install && npm run setup
* import Opentok API and SECRET keys into .env file

## Google OAuth
Refer to [here](https://developers.google.com/identity/sign-in/android/start-integrating) for extensive instructions.
#### Prerequisites
1. Add the Google Play Services SDK:
- In Android Studio, select Tools > Android > SDK Manager.
- Scroll to the bottom of the package list and select Extras > Google Repository. The package is downloaded to your computer and installed in your SDK environment at android-sdk-folder/extras/google/google_play_services.
#### Configuration File
1. Find SHA-1 hash of your signing certificate [here](https://developers.google.com/android/guides/client-auth).
2. Create or select existing project for application [here](https://developers.google.com/mobile/add?platform=android&cntapi=signin&cnturl=https:%2F%2Fdevelopers.google.com%2Fidentity%2Fsign-in%2Fandroid%2Fsign-in%3Fconfigured%3Dtrue&cntlbl=Continue%20Adding%20Sign-In).
3. Follow instructions to get a configuration file to add to your project.
4. Copy the google-services.json file you just downloaded into the app/ or mobile/ directory of your Android Studio project.
#### Google Services Plugin
1. Add the dependency to your project-level build.gradle:
```
classpath 'com.google.gms:google-services:3.0.0'
```
2. Add the plugin to your app-level build.gradle:
```
apply plugin: 'com.google.gms.google-services'
```
#### Google Play Services
1. Add Google Play Services as a dependency:
```
apply plugin: 'com.android.application'
    ...
    dependencies {
        compile 'com.google.android.gms:play-services-auth:9.8.0'
    }
```
#### Authentication with Backend Server
1. Open the Credentials page in the API Console.
2. The Web application type client ID is your backend server's OAuth 2.0 client ID. Pass this `client ID` to the `requestIdToken` or `requestServerAuthCode` method when you create the `GoogleSignInOptions` object.

## Swagger Documentation
swagger docs local route: localhost:3000/api-docs/
