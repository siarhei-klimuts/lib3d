/** @module preview
 * @description Closer look on books
 */
import THREE from 'three';

import * as camera from './camera';
import highlight from './highlight';

var active = false;
var container;

/** Is preview active
 * @returns {Boolean}
 */
export function isActive() {
	return active;
}

/** Show an object in preview mode
 * @param {BookObject} obj - an instance of BookObject
 */
export function enable(obj) {
	var objClone;

	if(obj) {
		activate(true);

		objClone = obj.clone();
		objClone.position.set(0, 0, 0);
		container.add(objClone);
	}
}

/** Disable preview mode */
export function disable () {
	clearContainer();
	activate(false);
}

/** Rotate an object in preview mode
 * @param {Number} dX - Vertical rotation value
 */
export function rotate(dX) {
	container.rotation.y += dX ? dX * 0.05 : 0;
}

function init() {
	container = new THREE.Object3D();
	container.position.set(0, 0, -0.5);
	container.rotation.y = -2;
	camera.camera.add(container);
}

function activate(value) {
	active = value;
	highlight.enable(!active);
}

function clearContainer() {
	container.children.forEach(function (child) {
		container.remove(child);
	});
}

init();