import Environment from 'environment';
import * as controls from 'controls';
import * as selector from 'selector';
import * as factory from 'factory';
import * as events from 'events';
import * as mouse from 'mouse';

import SelectorMetaDto from 'models/SelectorMetaDto';
import SectionObject from 'models/SectionObject';

describe('controls.js', () => {
    const SECTION_ID = '123';
    let section = factory.createSection({id: SECTION_ID});
    let intersected;
    let library;
    let env;

    function getIntersected() {
        return intersected;
    }
    
    beforeEach(() => {
        library = factory.createLibrary();
        library.addSection(section);
        
        Environment.prototype.initRenderer = function() {
            this.renderer = {
                setSize: () => {},
                render: () => {}
            };
        }
        
        env = new Environment();
        env.library = library;

        spyOn(mouse, 'getIntersected').and.callFake(getIntersected);
    });

    describe('onMouseDown', () => {
        beforeEach(() => {
            intersected = {object: section};
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            selector.select(new SelectorMetaDto(), library);
        });

        it('should selectFocused', () => {
            controls.onMouseDown({which: 1}, env);
            expect(selector.getSelectedId()).toBe(SECTION_ID);
        });

        it('should not selectFocused', () => {
            controls.onMouseDown({which: 3}, env);
            expect(selector.getSelectedId()).not.toBe(SECTION_ID);
        });

        it('should not selectFocused while preview', () => {
            controls.onMouseDown({which: 1}, env, true);
            expect(selector.getSelectedId()).not.toBe(SECTION_ID);
        });

        it('should unselect object', () => {
            intersected = null;
            selector.select(new SelectorMetaDto(SectionObject.TYPE, SECTION_ID), library);

            controls.onMouseDown({which: 1}, env);

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
            selector.select(new SelectorMetaDto(SectionObject.TYPE, SECTION_ID), library);
            changedObject = null;
            triggered = false;
        });

        it('should trigger object change', () => {
            mouse.keys[1] = true;
            controls.onMouseUp({which: 1}, env);
            expect(changedObject).toBeNull();
            expect(triggered).toBe(false);
        });

        it('should not trigger object change while preview', () => {
            controls.onMouseUp({which: 1}, env);

            expect(changedObject).toBeNull();
            expect(triggered).toBe(false);
        });
    });

    describe('onMouseMove', () => {
        var focusedObject;
        var changedObject;
        var triggeredFocus;
        var triggeredChange;

        events.onFocus(obj => {
            focusedObject = obj;
            triggeredFocus = true;
        });

        events.onObjectChange(obj => {
            changedObject = obj;
            triggeredChange = true;
        });

        beforeEach(() => {
            selector.focus(new SelectorMetaDto(), library);
            focusedObject = null;
            changedObject = null;
            triggeredFocus = false;
            triggeredChange = false;

            spyOn(section, 'move').and.callThrough();
        });

        it('should focus object under cursor', () => {
            intersected = {object: section};
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            controls.onMouseMove({
                preventDefault: () => {}
            }, env);

            expect(triggeredFocus).toBe(true);
            expect(triggeredChange).toBe(false);
            expect(focusedObject.getId()).toBe(SECTION_ID);
            expect(changedObject).toBeNull();
        });

        it('should move object under cursor', () => {
            selector.select(new SelectorMetaDto(SectionObject.TYPE, SECTION_ID), library);
            mouse.keys[1] = true;
            mouse.keys[3] = false;
            controls.onMouseMove({
                preventDefault: () => {}
            }, env);

            expect(triggeredFocus).toBe(false);
            expect(triggeredChange).toBe(false);
            expect(focusedObject).toBeNull();
            expect(changedObject).toBeNull();
            expect(section.move).toHaveBeenCalledTimes(1);
        });

        it('should not focus object while preview', () => {
            mouse.keys[1] = false;
            mouse.keys[3] = false;
            controls.onMouseMove({
                preventDefault: () => {}
            }, env, true);

            expect(triggeredFocus).toBe(false);
            expect(triggeredChange).toBe(false);
            expect(focusedObject).toBeNull();
            expect(changedObject).toBeNull();
        });

        it('should trigger object change once', function() {
            var event = {preventDefault: () => {}};

            selector.select(new SelectorMetaDto(SectionObject.TYPE, SECTION_ID), library);
            mouse.keys[1] = true;
            mouse.keys[3] = false;

            controls.onMouseMove(event, env);
            controls.onMouseMove(event, env);
            controls.onMouseMove(event, env);

            expect(triggeredFocus).toBe(false);
            expect(triggeredChange).toBe(false);
            expect(focusedObject).toBeNull();
            expect(changedObject).toBeNull();
            expect(section.move).toHaveBeenCalledTimes(3);

            controls.onMouseUp(null, env);

            expect(triggeredFocus).toBe(false);
            expect(triggeredChange).toBe(true);
            expect(focusedObject).toBeNull();
            expect(changedObject.getId()).toBe(SECTION_ID);
            expect(section.move).toHaveBeenCalledTimes(3);
        });
    });
});