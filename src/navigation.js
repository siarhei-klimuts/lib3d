/** 
 * @module lib3d.navigation
 * @description Helper for smooth camera control
 */

import * as camera from './camera';

const BUTTONS_ROTATE_SPEED = 100;
const BUTTONS_GO_SPEED = 0.02;

var state = {
	forward: false,
	backward: false,
	left: false,
	right: false,
	up: false,
	down: false,
	rotateX: 0,
	rotateY: 0
};

/**
 * @func Stop updating camera
 */
export function goStop() {
	state.forward = false;
	state.backward = false;
	state.left = false;
	state.right = false;
	state.up = false;
	state.down = false;
	state.rotateX = 0;
	state.rotateY = 0;
}

/**
 * @func Start moving camera forward 
 */
export function goForward() {
	state.forward = true;
}

/**
 * @func Start moving camera backward 
 */
export function goBackward() {
	state.backward = true;
}

/**
 * @func Start rotating camera left 
 */
export function goLeft() {
	state.left = true;
}

/**
 * @func Start rotating camera right
 */
export function goRight() {
	state.right = true;
}

/**
 * @func Start rotating camera up
 */
export function goUp() {
	state.up = true;
}

/**
 * @func Start rotating camera down
 */
export function goDown() {
	state.down = true;
}

/**
 * @func Change rotate camera speed
 */
export function rotate(speedX, speedY) {
	state.rotateX = speedX || 0;
	state.rotateY = speedY || 0;
}

/**
 * @func Update camera
 * @example lib3d.addLoop(lib3d.navigation.update);
 */
export function update() {
	if (state.forward) {
		camera.go(BUTTONS_GO_SPEED);
	} else if (state.backward) {
		camera.go(-BUTTONS_GO_SPEED);
	} else if (state.left) {
		camera.rotate(BUTTONS_ROTATE_SPEED, 0);
	} else if (state.right) {
		camera.rotate(-BUTTONS_ROTATE_SPEED, 0);
	} else if (state.up) {
		camera.rotate(0, BUTTONS_ROTATE_SPEED);
	} else if (state.down) {
		camera.rotate(0, -BUTTONS_ROTATE_SPEED);
	}
	if (state.rotateX || state.rotateY) {
		camera.rotate(state.rotateX, state.rotateY);
	}
}