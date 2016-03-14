var objectChangeEvent = obj => {};
var focusEvent = obj => {};
var selectEvent = obj => {};

export function onObjectChange(func) {
    objectChangeEvent = func;
}

export function triggerObjectChange(obj) {
    objectChangeEvent(obj);
}

export function onFocus(func) {
    focusEvent = func;
}

export function triggerFocus(obj) {
    focusEvent(obj);
}

export function onSelect(func) {
    selectEvent = func;
}

export function triggerSelect(obj) {
    selectEvent(obj);
}