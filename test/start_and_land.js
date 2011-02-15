var drone = require('../lib/ardrone')
drone.takeoff()
setTimeout(drone.land, 5000)
