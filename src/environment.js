import THREE from 'three';

import * as camera from './camera';
import * as locator from './locator';

/**
 * @deprecated
 */
let environment;

class Environment {
    constructor(canvas = undefined, width = 300, height = 300) {
        this.init(canvas);
        this.setSize(width, height);
        this.loops = [];
        this.startRenderLoop();
    }

    destructor() {
        //TODO: make sure that it cancels ONLY current instance's loop
        cancelAnimationFrame(this.renderLoopId);

        this.renderer.forceContextLoss();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer = null;
    }

    init(canvas) {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x90C3D4, 10, 75);

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas, 
            antialias: true
        });
        this.renderer.setClearColor(0x90C3D4);
    }

    setSize(width, height) {
        this.renderer.setSize(width, height, false);
        camera.setSize(width, height);
    }

    startRenderLoop() {
        this.renderer.render(this.scene, camera.camera);
        this.loops.forEach(func => func());

        this.renderLoopId = requestAnimationFrame(this.startRenderLoop.bind(this));
    }

    addLoop(func) {
        this.loops.push(func);
    }

    get library() {
        return this._library;
    }

    set library(library) {
        this.scene.remove(this._library);
        this._library = library;
        camera.setParent(library);

        if (library) {
            this.scene.add(library);
            locator.centerObject(library, camera.object);
        }
    }

    get canvas() {
        return this.renderer.domElement;
    }
}

/**
 * Inits lib3d, should be called first, use canvas with padding: 0
 * @alias module:lib3d.init
 * @param {canvas} [canvas] - chould be provided for lib3d output
 * @param {number} [width=300] - viewport width
 * @param {number} [height=300] - viewport height
 * @deprecated Use lib3d.new() instead
 */
export function init(canvas, width, height) {
    environment = new Environment(canvas, width, height);
}

/** Sets new canvas size, should be called after canvas size change
 * @param {number} width - New canvas width
 * @param {number} height - New canvas height
 * @deprecated
 */
export function setSize(width, height) {
    environment.setSize(width, height);
}

/**
 * Adds function to render loop
 * @alias module:lib3d.addLoop
 * @param {function} func - function will be called on every render call
 * @deprecated
 */
export function addLoop(func) {
    environment.addLoop(func);
}

/** Sets library as current
 * @param {LibraryObject} [newLibrary] - Library
 * @deprecated
 */
export function setLibrary(newLibrary) {
    environment.library = newLibrary;
}

/**
 * @returns {LibraryObject} Current library
 * @deprecated
 */
export function getLibrary() {
    return environment.library;
}

export default Environment;