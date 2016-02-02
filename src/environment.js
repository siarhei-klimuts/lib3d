/** @module environment
 * @description Main module, contains all the root entities
 */
import THREE from 'three';

import * as camera from './camera';
import * as locator from './locator';
import * as loader from './loader';

export var library = null;
export var renderer;
export var scene;

var loops = [];

/**
 * Inits lib3d, should be called first, use canvas with padding: 0
 * @param {canvas} canvas - chould be provided for lib3d output
 * @param {Number} width - viewport width
 * @param {Number} height- viewport height
 */
export function init(canvas, width, height) {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 4, 7);
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

export function setLibrary(newLibrary) {
    library = newLibrary;

    scene.add(library);
    camera.setParent(library);
    locator.centerObject(camera.object);
}

function startRenderLoop() {
    requestAnimationFrame(startRenderLoop);
    renderer.render(scene, camera.camera);

    loops.forEach(func => func());
}

/** Recreates section with new parameters if it has libraryId
 * or removes it if has not
 * @param {Object} dto - Section dto
 * @returns {Promise} Resolves with section dto
 */
// export function updateSection(dto) {
//     if(dto.libraryId == library.getId()) {
//         library.removeSection(dto.id);
//         return createSection(dto);
//     } else {
//         library.removeSection(dto.id);
//         return Promise.resolve(dto);
//     }
// }

/** Recreates book with new parameters if there is appropriate shelf
 * or removes it if shelf is not presented in book or doesn't exist on the scene
 * @param {Object} dto - Book dto
 * @returns {Promise} Resolves with book dto if placed or true if removed
 */
// export function updateBook(dto) {
//     if(library.getBookShelf(dto)) {
//         library.removeBook(dto.id);
//         return createBook(dto);
//     } else {
//         library.removeBook(dto.id);
//         return Promise.resolve(true);
//     }
// }