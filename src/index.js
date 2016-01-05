/** @module lib3d*/

import THREE from 'three';

import camera from './camera';
import environment from './environment';

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

var loops = [];
export var renderer;

/**
 * Inits lib3d, should be called first
 * @param {canvas} canvas - chould be provided for lib3d output
 */
export function init(canvas) {
	var width = canvas.width;
	var height = canvas.height;
	
	renderer = new THREE.WebGLRenderer({canvas: canvas || undefined, antialias: true});
	renderer.setSize(width, height);

	environment.scene = new THREE.Scene();
	environment.scene.fog = new THREE.Fog(0x000000, 4, 7);

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
 */
export function load(dto) {
	return environment.loadLibrary(dto);
}

function startRenderLoop() {
	requestAnimationFrame(startRenderLoop);

	loops.forEach(func => func());
	
	renderer.render(environment.scene, camera.camera);
}

export {
	camera,
	environment
};