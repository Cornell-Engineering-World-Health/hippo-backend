'use strict'
var fs = require('fs')
fs.createReadStream('.sample_env')
  .pipe(fs.createWriteStream('.env'))
