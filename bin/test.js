#!/usr/bin/env node

var drone = require('../lib/ardrone')

process.openStdin().on('data', function(cmd) {
  cmd = cmd.toString().trim()
  if (typeof drone[cmd] == 'function') {
    drone[cmd]()
  } else if (cmd.indexOf('=') > -1) {
    var parts = cmd.split('=')
    drone[parts[0].trim()] = parseInt(parts[1], 10)
  } else {
    console.log('NO SUCH COMMAND: ' + cmd)
  }
})

console.log('Ready for takeoff!')
