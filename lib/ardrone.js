var dgram = require('dgram')
var EventEmitter = require('events').EventEmitter

var c_helpers  = require('../build/default/c_helpers')
,   floatToInt = c_helpers.floatToInt
,   intToFloat = c_helpers.intToFloat


function log() {
  console.log.apply(console, arguments)
}


var HOSTNAME     = '192.168.1.1'
,   PORT         = 5556
//,   NAVDATA_PORT = 5554

var drone = {
  socket: dgram.createSocket('udp4'),

  // initialize movement
  roll:  0,
  pitch: 0,
  yaw:   0,
  gaz:   0,

  // every command must be sent with an increasing counter
  sequence: 1,

  _send: function() {
    var cmd = ''
    for (var i = 0, l = arguments.length; i < l; i++) {
      var argument = arguments[i]
      ,   method   = argument[0]
      ,   params   = argument.slice(1)
      params.unshift(drone.sequence) // add sequence at the end
      cmd += 'AT*' + method + '=' + params.join(',') + "\r"
      drone.sequence++
    }
    cmd = new Buffer(cmd)
    drone.socket.send(cmd, 0, cmd.length, PORT, HOSTNAME, function() {
      log(cmd.toString().replace(/\r/g, "\n").replace(/\n$/, ''))
    })
  },

  _sendConfig: function(key, val) {
    drone._send(['CONFIG', '"'+key+'"', '"'+val+'"'])
  },

  takeoff: function() {
    // TODO: FTRIM
    // TODO: AT*CONFIG
    drone._send(['REF', 290718208])
    clearInterval(drone.interval)
    drone.interval = setInterval(drone.move, 50)
  },

  land: function() {
    drone._send(['REF', 290717696])
    clearInterval(drone.interval)
    drone.interval = null
  },

  hover: function() {
    // stay on top of the same point on the ground
    drone.roll = drone.pitch = drone.yaw = 0
  },

  move: function() {
    var roll  = drone.roll
    ,   pitch = drone.pitch
    ,   yaw   = drone.yaw
    ,   gaz   = drone.gaz
    if (roll == 0 && pitch == 0 && yaw == 0 && gaz == 0) {
      // stay on top of the same point on the ground
      drone._send(['COMWDG'], ['PCMD', 0, 0, 0, 0, 0]); // first zero: hovering mode
    } else {
      drone._send(['COMWDG'], ['PCMD', 1, floatToInt(pitch), floatToInt(roll),
                                          floatToInt(gaz),   floatToInt(yaw)]);
    }
  },

  emergency: function() {
    // TODO
  },

  recover: function() {
    // TODO
  }
}

//drone.__proto__ = EventEmitter.prototype
//EventEmitter.call(drone)

//drone.sendConfig('control:altitude_max', 2000); // max 2m

module.exports = drone




// NAVDATA

/*ARDrone.prototype.initNavdata = function() {
  var s = this.navdataSocket = dgram.createSocket('udp4')
  var self = this
  s.once('message', function(msg, rinfo) {
    // check status bit
    //console.log('Navdata init response: ' + msg.toString())
    s.on('message', function(msg) {
      self.processNavdata(msg)
    })
    self.sendConfig('general:navdata_demo', 'FALSE')
    //s.once('message', function(msg, rinfo) {
    //  console.log(msg.toString())
    //  var buf = new Buffer("AT*CTRL=0\r")
    //  s.send(buf, 0, buf.length, NAVDATA_PORT, 'localhost')
    //  s.on('message', function(msg, rinfo) {
    //    console.log(msg.toString())
    //  })
    //})
  })
  s.bind(NAVDATA_PORT)
  
  var buf = new Buffer("1\r")
  s.send(buf, 0, buf.length, NAVDATA_PORT, this.hostname)
};

function intFromBuffer(buf, index, length) {
  var num = 0
  while (length) {
    num += buf[index] << (length-1)*8
    length--
    index++
  }
  //return num
  return str
}

Buffer.prototype.log = function() {
  var log = ''
  for (var i = 0, l = this.length; i < l; i++) {
    var byte = this[i]
    var str = byte.toString(2)
    var j = 8 - str.length
    while (j) {
      str = '0' + str
      j--
    }
    log += str + '|'
  }
  console.log(log)
}

ARDrone.prototype.processNavdata = function(buf) {
  if (buf.length >= 1192) {
    buf.slice(8, 12).log()
    //console.log('Buffer length: ' + buf.length)
    //var header   = intFromBuffer(buf, 0, 4)
    //,   state    = intFromBuffer(buf, 4, 4)
    //,   sequence = intFromBuffer(buf, 8, 4)
    //console.log(header, state, sequence)
  }
}

ARDrone.prototype.getNavdata = function() {
  // TODO
}*/

// TODO:
// video?
// repeat land command until navdata shows that drone is landed
