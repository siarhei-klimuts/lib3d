import THREE from 'three';

import CameraObject from './models/CameraObject';

/**
 * Represents camera
 */
export default class Camera {
    constructor(width, height) {
        this._camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 75);
        this._object = new CameraObject(this.camera);
        this.width = width;
        this.height = height;
    }

    /**
     * @type {THREE.PerspectiveCamera}
     */
    get camera() {
        return this._camera;
    }

    /**
     * @type {CameraObject}
     */
    get object() {
        return this._object;
    }

    /**
     * Camera position
     * @returns {THREE.Vector3}
     */
    get position() {
        return this.object.position;
    }

    /**
     * Set new parent
     * @param {THREE.Object3D} parent - new parent
     */
    setParent(parent) {
        if (this.object.parent) {
            this.object.parent.remove(this.object);
        }

        if (parent) {
            parent.add(this.object);
        }
    }

    /**
     * Rotate camera by two axes
     * @param {Number} x - horisontal angle
     * @param {Number} y - vertical angle
     */
    rotate(x, y) {
        var newX = this.object.rotation.x + y * 0.0001 || 0;
        var newY = this.object.rotation.y + x * 0.0001 || 0;

        if(newX < 1.57 && newX > -1.57) {   
            this.object.rotation.x = newX;
        }

        this.object.rotation.y = newY;
    }

    /**
     * Move camera forward or backward
     * @param {Number} speed - move speed, 
     * use negative number for backward move
     */
    go(speed) {
        var direction = this.getVector();
        var yPosition = this.object.position.y;
        var newPosition = this.object.position.clone();

        newPosition.add(direction.multiplyScalar(speed));
        this.object.move(newPosition);
        this.object.position.setY(yPosition);
    }

    /**
     * Look direction vector
     * @returns {THREE.Vector3} camera look vector
     */
    getVector() {
        var vector = new THREE.Vector3(0, 0, -1);
        return vector.applyEuler(this.object.rotation);
    }

    /**
     * Change aspect ratio of camera and screen size values,
     * call it all the time you cange viewport size
     * @param {Number} w - viewport width
     * @param {Number} h - viewport height
     */
    setSize(w, h) {
        this.width = w;
        this.height = h;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }
}
