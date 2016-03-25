/** @module lib3d.events */

/**
 * @callback objectChangeEvent
 * @param {BaseObject} obj - Changed object
 */
var objectChangeEvent = obj => {};

/**
 * @callback focusEvent
 * @param {BaseObject} obj - Focused object
 */
var focusEvent = obj => {};

/**
 * @callback selectEvent
 * @param {BaseObject} obj - Selected object
 */
var selectEvent = obj => {};

/** Sets function to call on object change event
 * @param {objectChangeEvent} func - Function to register as a callbask
 */
export function onObjectChange(func) {
    objectChangeEvent = func;
}

/** @ignore */
export function triggerObjectChange(obj) {
    objectChangeEvent(obj);
}

/** Sets function to call on object focus event
 * @param {focusEvent} func - Function to register as a callbask
 */
export function onFocus(func) {
    focusEvent = func;
}

/** @ignore */
export function triggerFocus(obj) {
    focusEvent(obj);
}

/** Sets function to call on object select event
 * @param {selectEvent} func - Function to register as a callbask
 */
export function onSelect(func) {
    selectEvent = func;
}

/** @ignore */
export function triggerSelect(obj) {
    selectEvent(obj);
}