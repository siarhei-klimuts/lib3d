import THREE from 'three';

import * as highlight from './highlight';

/**
 * Closer look on books
 */
export default class Preview {
    /**
     * @param {Camera} camera
     */
    constructor(camera) {
        this.active = false;
        this.container = new THREE.Object3D();
        this.container.position.set(0, 0, -0.5);
        this.container.rotation.y = -2;
        camera.camera.add(this.container);
    }

    /** Is preview active
     * @returns {Boolean}
     */
    isActive() {
        return this.active;
    }

    /** Show an object in preview mode
     * @param {BookObject} obj - an instance of BookObject
     */
    enable(obj) {
        var objClone;

        if(obj) {
            this.activate(true);

            objClone = new THREE.Mesh(obj.geometry, obj.material);
            objClone.position.set(0, 0, 0);
            this.container.add(objClone);
        }
    }

    /** Disable preview mode */
    disable() {
        this.clearContainer();
        this.activate(false);
    }

    /** Rotate an object in preview mode
     * @param {Number} dX - Vertical rotation value
     */
    rotate(dX) {
        this.container.rotation.y += dX ? dX * 0.05 : 0;
    }

    /** @private */
    activate(value) {
        this.active = value;
        highlight.enable(!this.active);
    }

    /** @private */
    clearContainer() {
        this.container.children
            .forEach(child => this.container.remove(child));
    }
}
