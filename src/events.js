var objectChange = obj => {};

export function onObjectChange(func) {
    objectChange = func;
}

export function triggerObjectChange(obj) {
    objectChange(obj);
}