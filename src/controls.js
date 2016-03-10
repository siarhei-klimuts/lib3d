import * as mouse from 'mouse';
import * as environment from 'environment';
import * as selector from 'selector';

import BookObject from 'models/BookObject';
import ShelfObject from 'models/ShelfObject';
import SectionObject from 'models/SectionObject';
import SelectorMeta from 'models/SelectorMeta';

export function onMouseDown(event) {
    mouse.down(event); 

    if (!environment.getLibrary()) return;

    if(mouse.keys[1] && !mouse.keys[3]) {
        focusObject();
        selector.selectFocused();
    }
}

export function onMouseUp(event) {
    mouse.up(event);
}

export function onMouseMove(event) {
    mouse.move(event);

    if (!environment.getLibrary()) return;

    if(mouse.keys[1] && !mouse.keys[3]) {       
        // controls.moveObject();
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