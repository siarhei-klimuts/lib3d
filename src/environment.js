import THREE from 'three';

import Camera from './camera';
import * as locator from './locator';

/*
 * Base class to hold library and manipulate it, accept or provide canvas
 * Responsible for context initialization, render loop, canvas resize, scene update
 * Use canvas with padding: 0 to avoid mouse coordinates issues
 */
class Environment {
    /**
     * @param {canvas} [canvas] - chould be provided for output
     * @param {number} [width=300] - viewport width
     * @param {number} [height=300] - viewport height
     */
    constructor(canvas = undefined, width = 300, height = 300) {
        this.initScene();
        this.initRenderer(canvas);
        this.camera = new Camera(width, height);
        this.setSize(width, height);
        this.loops = [];
        this.startRenderLoop();
    }

    /**
     * Call this before removing an instance of Environment
     */
    destructor() {
        //TODO: make sure that it cancels ONLY current instance's loop
        cancelAnimationFrame(this.renderLoopId);

        this.renderer.forceContextLoss();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer = null;
    }

    /*
     * @private
     */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x90C3D4, 10, 75);
    }

    /*
     * @private
     */
    initRenderer(canvas) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas, 
            antialias: true
        });
        this.renderer.setClearColor(0x90C3D4);
    }

    /** Sets new canvas size, should be called after canvas size change
     * @param {number} width - New canvas width
     * @param {number} height - New canvas height
     */
    setSize(width, height) {
        this.renderer.setSize(width, height, false);
        this.camera.setSize(width, height);
    }

    /**
     * @private
     */
    startRenderLoop() {
        this.renderer.render(this.scene, this.camera.camera);
        this.loops.forEach(func => func());

        this.renderLoopId = requestAnimationFrame(this.startRenderLoop.bind(this));
    }

    /**
     * Adds function to render loop
     * @param {function} func - function will be called on every render call
     */
    addLoop(func) {
        this.loops.push(func);
    }

    /**
     * @returns {LibraryObject} Current library
     */
    get library() {
        return this._library;
    }

    /** Sets library as current
     * @param {LibraryObject} [newLibrary] - Library
     */
    set library(library) {
        this.scene.remove(this._library);
        this._library = library;
        this.camera.setParent(library);

        if (library) {
            this.scene.add(library);
            locator.centerObject(library, this.camera.object);
        }
    }

    /**
     * @type {HTMLElement}
     */
    get canvas() {
        return this.renderer.domElement;
    }
}

export default Environment;