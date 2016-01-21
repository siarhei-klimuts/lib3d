/** @module lib3d*/

import THREE from 'three';

import camera from './camera';
import * as environment from './environment';

export {locator} from './locator';
export {mouse} from './mouse';
export {preview} from './preview';
export {selector} from './selector';
export {navigation} from './navigation';

export {default as ShelfObject} from './models/ShelfObject';
export {default as BookObject} from './models/BookObject';
export {default as SectionObject} from './models/SectionObject';
export {default as SelectorMeta} from './models/SelectorMeta';
export {default as SelectorMetaDto} from './models/SelectorMetaDto';

export {
	camera,
	environment
};

export var renderer;
var loops = [];

/**
 * Inits lib3d, should be called first
 * @param {canvas} canvas - chould be provided for lib3d output
 */
export function init(canvas, width, height) {
	renderer = new THREE.WebGLRenderer({canvas: canvas || undefined, antialias: true});
	renderer.setSize(width, height);

	startRenderLoop();
}

/**
 * Adds function to render loop
 * @param {function} func - function will be called on every render call
 */
export function addLoop(func) {
	loops.push(func);
}

//TODO: make separate loader module
/**
 * Loads library by an object
 * @param {object} dto - full library structure
 * @returns {Promise}
 */
export function load(dto) {
	return environment.loadLibrary(dto);
}

function startRenderLoop() {
	requestAnimationFrame(startRenderLoop);
	renderer.render(environment.scene, camera.camera);

	loops.forEach(func => func());
}