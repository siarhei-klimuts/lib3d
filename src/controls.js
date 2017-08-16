import * as mouse from 'mouse';
import * as events from 'events';

import BookObject from 'models/BookObject';
import ShelfObject from 'models/ShelfObject';
import SectionObject from 'models/SectionObject';
import SelectorMeta from 'models/SelectorMeta';

var objectMoved = false;

/** Triggers object select
 * @alias module:lib3d.onMouseDown
 * @param {Object} event - mouse event
 * @param {Environment} env - affected environment
 * @param {Boolean} isSideEffectsDisabled - disable side effects like focusing, selecting, moving objects
 */
function onMouseDown(event, env, isSideEffectsDisabled) {
    mouse.down(event, env ? env.camera : null);

    if (!env || isSideEffectsDisabled) {
        return;
    }

    if (mouse.keys[1] && !mouse.keys[3]) {
        let focusedObject = focusObject(env.library, env.camera, env.selector);

        if (env.selector.selectFocused()) {
            events.triggerSelect(focusedObject);
        }   
    }
}

/** Triggers object change
 * @alias module:lib3d.onMouseUp
 * @param {Object} event - mouse event
 * @param {Environment} env - affected environment
 * @param {Boolean} isSideEffectsDisabled - disable side effects like focusing, selecting, moving objects
 */
function onMouseUp(event, env, isSideEffectsDisabled) {
    mouse.up(event);

    if (!env || isSideEffectsDisabled) {
        return;
    }

    if (objectMoved) {
        if(env.selector.isSelectedEditable()) {
            events.triggerObjectChange(env.selector.getSelectedObject());
        }

        objectMoved = false;
    }
}

/** Triggers object focus
 * @alias module:lib3d.onMouseMove
 * @param {Object} event - mouse event
 * @param {Environment} env - affected environment
 * @param {Boolean} isSideEffectsDisabled - disable side effects like focusing, selecting, moving objects
 */
function onMouseMove(event, env, isSideEffectsDisabled) {
    event.preventDefault();
    mouse.move(event, env ? env.camera : null);

    if (!env || isSideEffectsDisabled) {
        return;
    }

    if(mouse.keys[1] && !mouse.keys[3]) {
        moveObject(env.library, env.camera, env.selector);
    } else {
        focusObject(env.library, env.camera, env.selector);
    }
}

function focusObject(library, camera, selector) {
    let intersected;
    let focusedObject;

    if (!library || !camera) {
        return focusedObject;
    }

    //TODO: optimize
    intersected = mouse.getIntersected(library.children, true, [BookObject], camera);
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [ShelfObject], camera);
    }
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [SectionObject], camera);
    }

    focusedObject = intersected ? intersected.object : null;
    
    if (selector.focus(new SelectorMeta(focusedObject))) {
        events.triggerFocus(focusedObject);
    }

    return focusedObject;
}

function moveObject(library, camera, selector) {
    if(!library || !camera || !selector.isSelectedEditable()) {
        return;
    }

    let selectedObject = selector.getSelectedObject(library);

    if(!selectedObject) {
        return;
    }

    let mouseVector = camera.getVector();
    let newPosition = selectedObject.position.clone();
    let parent = selectedObject.parent;
    parent.localToWorld(newPosition);

    newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
    newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

    parent.worldToLocal(newPosition);
    selectedObject.move(newPosition);

    objectMoved = true;
}

/** Rotate an object with avoiiding collisions and triggering objectChangeEvent
 * @alias module:lib3d.rotateObject
 * @param {BaseObject} obj - Object to rotate
 * @param {THREE.Vector3} rotation - A vector with rotation angles in radians
 * @param {String} order - Euler angles order (optional)
 */
function rotateObject(obj, rotation, order) {
    let originRotation = obj.rotation.clone();
    obj.rotation.setFromVector3(originRotation.toVector3().add(rotation), order);

    if (obj.isCollided()) {
        obj.rotation.setFromVector3(originRotation.toVector3(), originRotation.order);
        return false;
    }

    obj.updateBoundingBox();
    events.triggerObjectChange(obj);

    return true;
}

export {
    onMouseDown,
    onMouseUp,
    onMouseMove,
    rotateObject
};