import * as mouse from 'mouse';
import * as environment from 'environment';
import * as selector from 'selector';
import * as camera from 'camera';
import * as preview from 'preview';
import * as events from 'events';

import BookObject from 'models/BookObject';
import ShelfObject from 'models/ShelfObject';
import SectionObject from 'models/SectionObject';
import SelectorMeta from 'models/SelectorMeta';

var objectMoved = false;

/** Triggers object select
 * @alias module:lib3d.onMouseDown
 * @param {Object} event - mouse event
 */
export function onMouseDown(event, env = environment) {
    let focusedObject;
    mouse.down(event);

    if (!env.library || preview.isActive()) 
        return;

    if (mouse.keys[1] && !mouse.keys[3]) {
        focusedObject = focusObject(env);
        
        if (selector.selectFocused(env.library)) {
            events.triggerSelect(focusedObject);
        }   
    }
}

/** Triggers object change
 * @alias module:lib3d.onMouseUp
 * @param {Object} event - mouse event
 */
export function onMouseUp(event, env = environment) {
    mouse.up(event);
        
    if (preview.isActive())
        return;

    if (objectMoved) {
        if(selector.isSelectedEditable()) {
            events.triggerObjectChange(selector.getSelectedObject(env.library));
        }

        objectMoved = false;
    }
}

/** Triggers object focus
 * @alias module:lib3d.onMouseMove
 * @param {Object} event - mouse event
 */
export function onMouseMove(event, env = environment) {
    event.preventDefault();
    mouse.move(event);

    if (!env.library || preview.isActive())
        return;

    if(mouse.keys[1] && !mouse.keys[3]) {       
        moveObject(env);
    } else {
        focusObject(env);
    }
}

function focusObject(env) {
    let library = env.library;
    let intersected;
    let focusedObject;

    //TODO: optimize
    intersected = mouse.getIntersected(library.children, true, [BookObject]);
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [ShelfObject]);
    }
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [SectionObject]);
    }

    focusedObject = intersected ? intersected.object : null;
    
    if (selector.focus(new SelectorMeta(focusedObject), library)) {
        events.triggerFocus(focusedObject);
    }

    return focusedObject;
}

function moveObject(env) {
    var mouseVector;
    var newPosition;
    var parent;
    var selectedObject;

    if(selector.isSelectedEditable()) {
        selectedObject = selector.getSelectedObject(env.library);

        if(selectedObject) {
            mouseVector = camera.getVector();   
            newPosition = selectedObject.position.clone();
            parent = selectedObject.parent;
            parent.localToWorld(newPosition);

            newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
            newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

            parent.worldToLocal(newPosition);
            selectedObject.move(newPosition);

            objectMoved = true;
        }
    }
}