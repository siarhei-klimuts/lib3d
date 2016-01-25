/** @module lib3d*/

import THREE from 'three';

import * as camera from './camera';
import * as environment from './environment';
import * as locator from './locator';
import * as mouse from './mouse';
import * as preview from './preview';
import * as selector from './selector';
import * as navigation from './navigation';


export {default as ShelfObject} from './models/ShelfObject';
export {default as BookObject} from './models/BookObject';
export {default as SectionObject} from './models/SectionObject';
export {default as SelectorMeta} from './models/SelectorMeta';
export {default as SelectorMetaDto} from './models/SelectorMetaDto';

export {
	camera,
	environment,
	locator,
	mouse,
	preview,
	selector,
	navigation
};

export var renderer;
var loops = [];

/**
 * Inits lib3d, should be called first, use canvas with padding: 0
 * @param {canvas} canvas - chould be provided for lib3d output
 * @param {Number} width - viewport width
 * @param {Number} height- viewport height
 */
export function init(canvas, width, height) {
	renderer = new THREE.WebGLRenderer({canvas: canvas || undefined, antialias: true});
	renderer.setSize(width, height);
	camera.setSize(width, height);

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