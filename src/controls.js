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

export function onMouseDown(event) {
    mouse.down(event); 

    if (!environment.getLibrary() || preview.isActive()) return;

    if (mouse.keys[1] && !mouse.keys[3]) {
        focusObject();
        selector.selectFocused();
    }
}

export function onMouseUp(event) {
    var key = mouse.keys[1];
    mouse.up(event);
        
    if (preview.isActive()) return;

    if (key) {
        if(selector.isSelectedEditable()) {
            events.triggerObjectChange(selector.getSelectedObject());
        }
    }
}

export function onMouseMove(event) {    
    event.preventDefault();
    mouse.move(event);

    if (!environment.getLibrary() || preview.isActive()) return;

    if(mouse.keys[1] && !mouse.keys[3]) {       
        moveObject();
    } else {
        focusObject();
    }
}

function focusObject() {
    var library = environment.getLibrary();
    var intersected;

    //TODO: optimize
    intersected = mouse.getIntersected(library.children, true, [BookObject]);
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [ShelfObject]);
    }
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [SectionObject]);
    }

    selector.focus(new SelectorMeta(intersected ? intersected.object : null));
}

function moveObject() {
    var mouseVector;
    var newPosition;
    var parent;
    var selectedObject;

    if(selector.isSelectedEditable()) {
        selectedObject = selector.getSelectedObject();

        if(selectedObject) {
            mouseVector = camera.getVector();   
            newPosition = selectedObject.position.clone();
            parent = selectedObject.parent;
            parent.localToWorld(newPosition);

            newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
            newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

            parent.worldToLocal(newPosition);
            selectedObject.move(newPosition);
        }
    }
}