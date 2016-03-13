/** @module mouse 
 * @description Contains current mouse state,
 * functions to update state trough mouse events,
 * helps to find clicked 3D object
 */

import THREE from 'three';

import * as camera from './camera';

/** Keys states */
export var keys = {};

/** Delta X - horisontal distance between two move events */
export var dX = null;

/** Delta Y - vertical distance between two move events */
export var dY = null;

/** Horisontal distance of mouse pointer to canvas center */
export var longX = null;

/** Vertical distance of mouse pointer to canvas center */
export var longY = null;

var x = null;
var y = null;
//TODO: remove as not used
var target = null;

/** Last down or move event target
 * @returns target
 */
export function getTarget() {
	return target;
}

/** Update current state by onmousedown event
 * @param event
 */
export function down(event) {
	if(event) {
		keys[event.which] = true;
		target = event.target;
		x = event.offsetX;
		y = event.offsetY;
		longX = getWidth() * 0.5 - x;
		longY = getHeight() * 0.5 - y;
	}
}

/** Update current state by onmouseup event
 * @param event
 */
export function up(event) {
	if(event) {
		keys[event.which] = false;
		// linux chrome bug fix (when both keys release then both event.which equal 3)
		keys[1] = false; 
	}
}

/** Update current state by onmousemove event
 * @param event
 */
export function move(event) {
	if(event) {
		target = event.target;
		//TODO x,y to offsetX, offsetY + update mouse.test.js
		longX = getWidth() * 0.5 - x;
		longY = getHeight() * 0.5 - y;
		dX = event.offsetX - x;
		dY = event.offsetY - y;
		x = event.offsetX;
		y = event.offsetY;
	}
}

/**
 * @param {Array} objects - Objects to check for collisions
 * @param {Boolean} recursive - Recursive check
 * @param {Array} searchFor - Array of classes to check
 * @returns {Object} The closest intersected object
 * 
 * @example 
 * var intersected = lib3d.mouse.getIntersected(lib3d.getLibrary().children, true, [BookObject]);
 * //intersected.object is an instance of BookObject
 */
export function getIntersected(objects, recursive, searchFor) {
	var
		vector,
		raycaster,
		intersects,
		intersected,
		result,
		i, j;

	result = null;
	vector = getVector();
	raycaster = new THREE.Raycaster();
	raycaster.set(camera.getPosition(), vector);
	intersects = raycaster.intersectObjects(objects, recursive);

	if(searchFor) {
		if(intersects.length) {
			for(i = 0; i < intersects.length; i++) {
				intersected = intersects[i];
				
				for(j = searchFor.length - 1; j >= 0; j--) {
					if(intersected.object instanceof searchFor[j]) {
						result = intersected;
						break;
					}
				}

				if(result) {
					break;
				}
			}
		}		
	} else {
		result = intersects;
	}

	return result;
}

function getVector() {
	var vector = new THREE.Vector3((x / getWidth()) * 2 - 1, - (y / getHeight()) * 2 + 1, 0.5);
	vector.unproject(camera.camera);

	return vector.sub(camera.getPosition()).normalize();
}

function getWidth() {
	return camera.width;
}

function getHeight() {
	return camera.height;
}