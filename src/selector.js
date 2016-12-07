/** @module lib3d.selector 
 * @description Helper for focusing and selecting objects
 */

import SelectorMeta from './models/SelectorMeta';
import ShelfObject from './models/ShelfObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import * as highlight from './highlight';

var selected = new SelectorMeta();
var focused = new SelectorMeta();

/**
 * @returns {String} id of selected object
 */
export function getSelectedId() {
    return selected.id;
}

/** Focus object
 * @param {lib3d.SelectorMeta} meta - object to focus
 * @param {LibraryObject} library - library to search for objects
 * @returns {boolean} true if focused object was changed
 */
export function focus(meta, library) {
    var obj;

    if(!meta.equals(focused)) {
        focused = meta;

        if(!focused.isEmpty()) {
            obj = getFocusedObject(library);
            highlight.focus(obj);
        }

        return true;
    }

    return false;
}

/**
 * Make current focused object to be selected
 * @param {LibraryObject} library - library to search for objects
 * @returns {boolean} true if selected object was changed
 */
export function selectFocused(library) {
    return select(focused, library);
}

/** Select object
 * @param {lib3d.SelectorMeta} meta - object to select
 * @param {LibraryObject} library - library to search for objects
 * @returns {boolean} true if selected object was changed
 */
export function select(meta, library) {
    var isChanged = false;
    var obj = getObject(meta, library);

    if(!meta.equals(selected)) {
        isChanged = true;
    }
    
    unselect();
    selected = meta;

    highlight.select(obj);
    highlight.focus(null);

    return isChanged;
}

/**
 * Unselect current sellected object
 */
export function unselect() {
    if(!selected.isEmpty()) {
        highlight.select(null);
        selected = new SelectorMeta();
    }
}

/**
 * @param {LibraryObject} library - library to search for objects
 * @returns {lib3d.BaseObject} Selected object
 */
export function getSelectedObject(library) {
    return getObject(selected, library);
}

/**
 * @param {LibraryObject} library - library to search for objects
 * @returns {lib3d.BaseObject} Focused object
 */
export function getFocusedObject(library) {
    return getObject(focused, library);
}

function getObject(meta, library) {
    var object;

    if(!meta.isEmpty()) {
        object = isShelf(meta) ? library.getShelf(meta.parentId, meta.id)
            : isBook(meta) ? library.getBook(meta.id)
            : isSection(meta) ? library.getSection(meta.id)
            : null;
    }

    return object;
}

/**
 * @returns {Boolean} Is selected object can be edited
 */
export function isSelectedEditable() {
    return isSelectedBook() || isSelectedSection();
}

/**
 * @param {String} id - Book id
 * @returns {Boolean} True if selected object is book with given id
 */
export function isBookSelected(id) {
    return isBook(selected) && selected.id === id;
}

/**
 * @returns {Boolean} Is shelf selected
 */
export function isSelectedShelf() {
    return isShelf(selected);
}

/**
 * @returns {Boolean} Is book selected
 */
export function isSelectedBook() {
    return isBook(selected);
}

/**
 * @returns {Boolean} Is section selected
 */
export function isSelectedSection() {
    return isSection(selected);
}

function isShelf(meta) {
    return meta.type === ShelfObject.TYPE;
}

function isBook(meta) {
    return meta.type === BookObject.TYPE;
}

function isSection(meta) {
    return meta.type === SectionObject.TYPE;
}