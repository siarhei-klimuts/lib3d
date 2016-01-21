/** 
 * @module navigation
 * @description Helper for smooth camera control
 */

import * as camera from './camera';
export var navigation = {};

navigation.BUTTONS_ROTATE_SPEED = 100;
navigation.BUTTONS_GO_SPEED = 0.02;

var state = {
	forward: false,
	backward: false,
	left: false,
	right: false,
	up: false,
	down: false
};

/**
 * @func Stop updating camera
 */
navigation.goStop = function() {
	state.forward = false;
	state.backward = false;
	state.left = false;
	state.right = false;
	state.up = false;
	state.down = false;
};

/**
 * @func Start moving camera forward 
 */
navigation.goForward = function() {
	state.forward = true;
};

/**
 * @func Start moving camera backward 
 */
navigation.goBackward = function() {
	state.backward = true;
};

/**
 * @func Start rotating camera left 
 */
navigation.goLeft = function() {
	state.left = true;
};

/**
 * @func Start rotating camera right
 */
navigation.goRight = function() {
	state.right = true;
};

/**
 * @func Start rotating camera up
 */
navigation.goUp = function() {
	state.up = true;
};

/**
 * @func Start rotating camera down
 */
navigation.goDown = function() {
	state.down = true;
};

/**
 * @func Update camera
 * @example lib3d.addLoop(lib3d.navigation.update);
 */
navigation.update = function() {
	if(state.forward) {
		camera.go(navigation.BUTTONS_GO_SPEED);
	} else if(state.backward) {
		camera.go(-navigation.BUTTONS_GO_SPEED);
	} else if(state.left) {
		camera.rotate(navigation.BUTTONS_ROTATE_SPEED, 0);
	} else if(state.right) {
		camera.rotate(-navigation.BUTTONS_ROTATE_SPEED, 0);
	} else if(state.up) {
		camera.rotate(0, navigation.BUTTONS_ROTATE_SPEED);
	} else if(state.down) {
		camera.rotate(0, -navigation.BUTTONS_ROTATE_SPEED);
	}
};