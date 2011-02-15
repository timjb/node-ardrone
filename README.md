node-ardrone
============

Installation
------------

	$ npm install ardrone


Setup
-----

Before using this library, you need to join your ARDrone's WIFI network.

You can test your connection using `ardrone-test`:

	$ ardrone-test > ardrone-log
	Ready for takeoff!
	takeoff
	land


Usage
-----

This starts the drone in hovering mode (stay above one point on the ground) and lands it after 5 seconds:

	var drone = require('ardrone')
	drone.takeoff()
	setTimeout(drone.land, 5000)


Features
--------

* Send commands to the drone
  * takeoff
  * land
  * move up, down, left, right, forwards, backwards, turn around

**Not** implemented (yet?):

* Receive and parse navdata
* Video streaming


Disclaimer
-------------

Use this software at your own risk!
