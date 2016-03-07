/** @module environment
 * @description Main module, contains all the root entities
 */
import THREE from 'three';

import * as camera from './camera';
import * as locator from './locator';

export var renderer;
export var scene;

var library = null;
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
    setSize(width, height);

    startRenderLoop();
}

export function setSize(width, height) {
    renderer.setSize(width, height);
    camera.setSize(width, height);
}

/**
 * Adds function to render loop
 * @param {function} func - function will be called on every render call
 */
export function addLoop(func) {
    loops.push(func);
}

export function setLibrary(newLibrary) {
    scene.remove(library);
    library = newLibrary;

    scene.add(newLibrary);
    camera.setParent(newLibrary);
    locator.centerObject(camera.object);
}

export function getLibrary() {
    return library;
}

function startRenderLoop() {
    requestAnimationFrame(startRenderLoop);
    renderer.render(scene, camera.camera);

    loops.forEach(func => func());
}