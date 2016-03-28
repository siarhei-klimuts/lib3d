import * as environment from 'environment';
import * as controls from 'controls';
import * as selector from 'selector';
import * as factory from 'factory';
import * as events from 'events';
import * as preview from 'preview';
import * as mouse from 'mouse';

import SelectorMetaDto from 'models/SelectorMetaDto';
import SectionObject from 'models/SectionObject';

describe('controls.js', () => {
    const SECTION_ID = '123';
    var section = factory.createSection({id: SECTION_ID});
    var intersected;

    function getIntersected() {
        return intersected;
    }
    
    beforeEach(() => {
        let library = factory.createLibrary();

        library.addSection(section);

        environment.init();
        environment.setLibrary(library);

        spyOn(mouse, 'getIntersected').and.callFake(getIntersected);
    });

    describe('onMouseDown', () => {
        beforeEach(() => {
            intersected = {object: section};
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            selector.select(new SelectorMetaDto());
            selector.focus
        });

        it('should selectFocused', () => {
            controls.onMouseDown({which: 1});
            expect(selector.getSelectedId()).toBe(SECTION_ID);
        });

        it('should not selectFocused', () => {
            controls.onMouseDown({which: 3});
            expect(selector.getSelectedId()).not.toBe(SECTION_ID);
        });

        it('should not selectFocused while preview', () => {
            preview.enable(section);
            controls.onMouseDown({which: 1});

            expect(selector.getSelectedId()).not.toBe(SECTION_ID);
        });

        it('should unselect object', () => {
            intersected = null;
            selector.select(new SelectorMetaDto(SectionObject.TYPE, SECTION_ID));

            controls.onMouseDown({which: 1});

            expect(selector.getSelectedId()).not.toBe(SECTION_ID);
        });
    });

    describe('onMouseUp', () => {
        var changedObject;
        var triggered;

        events.onObjectChange(obj => {
            changedObject = obj;
            triggered = true;
        });

        beforeEach(() => {
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            selector.select(new SelectorMetaDto(SectionObject.TYPE, SECTION_ID));
            changedObject = null;
            triggered = false;
        });

        it('should trigger object change', () => {
            mouse.keys[1] = true;
            controls.onMouseUp({which: 1});
            expect(changedObject.getId()).toBe(SECTION_ID);
            expect(triggered).toBe(true);
        });

        it('should not trigger object change while preview', () => {
            preview.enable(section);
            controls.onMouseUp({which: 1});

            expect(changedObject).toBeNull();
            expect(triggered).toBe(false);
        });
    });

    describe('onMouseMove', () => {
        var focusedObject;
        var triggered;

        events.onFocus(obj => {
            focusedObject = obj;
            triggered = true;
        });

        beforeEach(() => {
            preview.disable();

            selector.focus(new SelectorMetaDto());
            focusedObject = null;
            triggered = false;

            spyOn(section, 'move').and.callThrough();
        });

        it('should focus object under cursor', () => {
            intersected = {object: section};
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            controls.onMouseMove({
                preventDefault: () => {}
            });

            expect(triggered).toBe(true);
            expect(focusedObject.getId()).toBe(SECTION_ID);
        });

        it('should move object under cursor', () => {
            mouse.keys[1] = true;
            mouse.keys[3] = false;
            controls.onMouseMove({
                preventDefault: () => {}
            });

            expect(triggered).toBe(false);
            expect(focusedObject).toBeNull();
            expect(section.move).toHaveBeenCalledTimes(1);
        });

        it('should not focus object while preview', () => {
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            preview.enable(section);
            controls.onMouseMove({
                preventDefault: () => {}
            });

            expect(triggered).toBe(false);
            expect(focusedObject).toBeNull();
        });
    });
});