/** @module camera 
 * @protected
 * @description Represents camera
 */

import THREE from 'three';

import CameraObject from './models/CameraObject';

/** @protected */
export var width = 300;
/** @protected */
export var height = 300;

/**
 * @protected
 * @type {THREE.PerspectiveCamera}
 */
export var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);

/**
 * @protected
 * @type {CameraObject}
 */
export var object = new CameraObject(camera);

/**
 * Set new parent
 * @protected
 * @param {THREE.Object3D} parent - new parent
 */
export function setParent(parent) {
	parent.add(object);
}

/**
 * Camera position
 * @protected
 * @returns {THREE.Vector3}
 */
export function getPosition() {
	return object.position;
}

/**
 * Rotate camera by two axes
 * @protected
 * @param {Number} x - horisontal angle
 * @param {Number} y - vertical angle
 */
export function rotate(x, y) {
	var newX = object.rotation.x + y * 0.0001 || 0;
	var newY = object.rotation.y + x * 0.0001 || 0;

	if(newX < 1.57 && newX > -1.57) {	
		object.rotation.x = newX;
	}

	object.rotation.y = newY;
}

/**
 * Move camera forward or backward
 * @protected
 * @param {Number} speed - move speed, 
 * use negative number for backward move
 */
export function go(speed) {
	var direction = getVector();
	var yPosition = object.position.y;
	var newPosition = object.position.clone();

	newPosition.add(direction.multiplyScalar(speed));
	object.move(newPosition);
	object.position.setY(yPosition);
}

/**
 * Look vector
 * @protected
 * @returns {THREE.Vector3} camera look vector
 */
export function getVector() {
	var vector = new THREE.Vector3(0, 0, -1);

	return vector.applyEuler(object.rotation);
}

/**
 * Change aspect ratio of camera and screen size values,
 * call it all the time you cange viewport size
 * @protected
 * @param {Number} w - viewport width
 * @param {Number} h - viewport height
 */
export function setSize(w, h) {
	width = w;
	height = h;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}