/** @module selector 
 * @description Helper for focusing and selecting objects
 */

import SelectorMeta from './models/SelectorMeta';
import ShelfObject from './models/ShelfObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import * as environment from './environment';
import * as preview from './preview';
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
 */
export function focus(meta) {
	var obj;

	if(!meta.equals(focused)) {
		focused = meta;

		if(!focused.isEmpty()) {
			obj = getFocusedObject();
			highlight.focus(obj);
		}
	}
}

/**
 * Make current focused object to be selected
 */
export function selectFocused() {
	select(focused);
}

/** Select object
 * @param {lib3d.SelectorMeta} meta - object to select
 */
export function select(meta) {
	var obj = getObject(meta);
	
	unselect();
	selected = meta;

	highlight.select(obj);
	highlight.focus(null);
}

/**
 * Unselect current sellected object
 */
export function unselect() {
	if(!selected.isEmpty()) {
		highlight.select(null);
		selected = new SelectorMeta();
	}

	preview.disable();
}

/**
 * @returns {lib3d.BaseObject} Selected object
 */
export function getSelectedObject() {
	return getObject(selected);
}

/**
 * @returns {lib3d.BaseObject} Focused object
 */
export function getFocusedObject() {
	return getObject(focused);
}

function getObject(meta) {
	var object;

	if(!meta.isEmpty()) {
		object = isShelf(meta) ? environment.getLibrary().getShelf(meta.parentId, meta.id)
			: isBook(meta) ? environment.getLibrary().getBook(meta.id)
			: isSection(meta) ? environment.getLibrary().getSection(meta.id)
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