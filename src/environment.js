import THREE from 'three';

import * as camera from './camera';
import * as locator from './locator';

export var renderer;
export var scene;

var library = null;
var loops = [];

/**
 * Inits lib3d, should be called first, use canvas with padding: 0
 * @alias module:lib3d.init
 * @param {canvas} [canvas] - chould be provided for lib3d output
 * @param {number} [width=300] - viewport width
 * @param {number} [height=300] - viewport height
 */
export function init(canvas, width=300, height=300) {
    if (!scene) {
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x90C3D4, 10, 75);
    }

    if (!renderer) {
        renderer =  new THREE.WebGLRenderer({
            canvas: canvas || undefined, 
            antialias: true
        });
        renderer.setClearColor(0x90C3D4);
    }

    setSize(width, height);
    startRenderLoop();
}

/** Sets new canvas size, should be called after canvas size change
 * @param {number} width - New canvas width
 * @param {number} height - New canvas height
 */
export function setSize(width, height) {
    renderer.setSize(width, height);
    camera.setSize(width, height);
}

/**
 * Adds function to render loop
 * @alias module:lib3d.addLoop
 * @param {function} func - function will be called on every render call
 */
export function addLoop(func) {
    loops.push(func);
}

/** Sets library as current
 * @param {LibraryObject} [newLibrary] - Library
 */
export function setLibrary(newLibrary) {
    scene.remove(library);
    library = newLibrary;
    camera.setParent(newLibrary);

    if (newLibrary) {
        scene.add(newLibrary);
        locator.centerObject(newLibrary, camera.object);
    }
}

/**
 * @returns {LibraryObject} Current library
 */
export function getLibrary() {
    return library;
}

export function setRenderer(newRenderer) {
    renderer = newRenderer;
}

function startRenderLoop() {
    requestAnimationFrame(startRenderLoop);
    renderer.render(scene, camera.camera);

    loops.forEach(func => func());
}