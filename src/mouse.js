/** @module lib3d.mouse 
 * @description Contains current mouse state,
 * functions to update state trough mouse events,
 * helps to find clicked 3D object
 */

import THREE from 'three';

/** Keys states */
export var keys = {};

/** Delta X - horisontal distance between two move events */
export var dX = null;

/** Delta Y - vertical distance between two move events */
export var dY = null;

/** Horisontal distance of mouse pointer to canvas center */
export var longX = null;

/** Vertical distance of mouse pointer to canvas center */
export var longY = null;

var x = null;
var y = null;

/** Update current state by onmousedown event
 * @param event
 * @param {Camera} [camera] - current environment camera
 */
export function down(event, camera) {
    if(event) {
        keys[event.which] = true;
        x = event.offsetX;
        y = event.offsetY;

        if (camera) {
            longX = camera.width * 0.5 - x;
            longY = camera.height * 0.5 - y;
        }
    }
}

/** Update current state by onmouseup event
 * @param event
 */
export function up(event) {
    if(event) {
        keys[event.which] = false;
        // linux chrome bug fix (when both keys release then both event.which equal 3)
        keys[1] = false; 
    }
}

/** Update current state by onmousemove event
 * @param event
 * @param {Camera} [camera] - current environment camera
 */
export function move(event, camera) {
    if(event) {
        if (camera) {
            longX = camera.width * 0.5 - x;
            longY = camera.height * 0.5 - y;
        }

        dX = event.offsetX - x;
        dY = event.offsetY - y;
        x = event.offsetX;
        y = event.offsetY;
    }
}

/**
 * @param {Array} objects - Objects to check for collisions
 * @param {Boolean} recursive - Recursive check
 * @param {Array} searchFor - Array of classes to check
 * @param {Camera} camera - current environment camera
 * @returns {Object} The closest intersected object
 * 
 * @example 
 * var intersected = lib3d.mouse.getIntersected(env.library.children, true, [BookObject], env.camera);
 * //intersected.object is an instance of BookObject
 */
export function getIntersected(objects, recursive, searchFor, camera) {
    let result = null;

    if (!camera) {
        return result;
    }

    let vector = getVector(camera);
    let raycaster = new THREE.Raycaster();
    raycaster.set(camera.position, vector);
    let intersects = raycaster.intersectObjects(objects, recursive);

    if(searchFor) {
        if(intersects.length) {
            for(let i = 0; i < intersects.length; i++) {
                let intersected = intersects[i];

                for(let j = searchFor.length - 1; j >= 0; j--) {
                    if(intersected.object instanceof searchFor[j]) {
                        result = intersected;
                        break;
                    }
                }

                if(result) {
                    break;
                }
            }
        }
    } else {
        result = intersects;
    }

    return result;
}

function getVector(camera) {
    var vector = new THREE.Vector3((x / camera.width) * 2 - 1, - (y / camera.height) * 2 + 1, 0.5);
    vector.unproject(camera.camera);

    return vector.sub(camera.position).normalize();
}