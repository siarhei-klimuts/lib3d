import SelectorMeta from './models/SelectorMeta';
import ShelfObject from './models/ShelfObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import Highlight from './highlight';

/** 
 * Helper for focusing and selecting objects
 */
export default class Selector {
    constructor() {
        this.highlight = new Highlight();
        this.selected = new SelectorMeta();
        this.focused = new SelectorMeta();
    }

    /** @type {lib3d.LibraryObject} */
    get library() {
        return this._library;
    }

    /** @type {lib3d.LibraryObject} */
    set library(library) {
        this._library = library;
    }

    /**
     * @returns {String} id of selected object
     */
    getSelectedId() {
        return this.selected.id;
    }

    /** Focus object
     * @param {lib3d.SelectorMeta} meta - object to focus
     * @returns {boolean} true if focused object was changed
     */
    focus(meta) {
        var obj;

        if(!meta.equals(this.focused)) {
            this.focused = meta;

            if(!this.focused.isEmpty()) {
                obj = this.getFocusedObject();
                this.highlight.focus(obj);
            }

            return true;
        }

        return false;
    }

    /**
     * Make current focused object to be selected
     * @returns {boolean} true if selected object was changed
     */
    selectFocused() {
        return this.select(this.focused);
    }

    /** Select object
     * @param {lib3d.SelectorMeta} meta - object to select
     * @returns {boolean} true if selected object was changed
     */
    select(meta) {
        let isChanged = false;
        let obj = this.getObject(meta);

        if(!meta.equals(this.selected)) {
            isChanged = true;
        }
        
        this.unselect();
        this.selected = meta;

        this.highlight.select(obj);
        this.highlight.focus(null);

        return isChanged;
    }

    /**
     * Unselect current sellected object
     */
    unselect() {
        if(!this.selected.isEmpty()) {
            this.highlight.select(null);
            this.selected = new SelectorMeta();
        }
    }

    /**
     * @returns {lib3d.BaseObject} Selected object
     */
    getSelectedObject() {
        return this.getObject(this.selected);
    }

    /**
     * @returns {lib3d.BaseObject} Focused object
     */
    getFocusedObject() {
        return this.getObject(this.focused);
    }

    /**
     * @private
     */
    getObject(meta) {
        let object;

        if(!meta.isEmpty() && this.library) {
            object = this.isShelf(meta) ? this.library.getShelf(meta.parentId, meta.id)
                : this.isBook(meta) ? this.library.getBook(meta.id)
                : this.isSection(meta) ? this.library.getSection(meta.id)
                : null;
        }

        return object;
    }

    /**
     * @returns {Boolean} Is selected object can be edited
     */
    isSelectedEditable() {
        return this.isSelectedBook() || this.isSelectedSection();
    }

    /**
     * @param {String} id - Book id
     * @returns {Boolean} True if selected object is book with given id
     */
    isBookSelected(id) {
        return this.isBook(this.selected) && this.selected.id === id;
    }

    /**
     * @returns {Boolean} Is shelf selected
     */
    isSelectedShelf() {
        return this.isShelf(this.selected);
    }

    /**
     * @returns {Boolean} Is book selected
     */
    isSelectedBook() {
        return this.isBook(this.selected);
    }

    /**
     * @returns {Boolean} Is section selected
     */
    isSelectedSection() {
        return this.isSection(this.selected);
    }

    /**
     * @private
     */
    isShelf(meta) {
        return meta.type === ShelfObject.TYPE;
    }

    /**
     * @private
     */
    isBook(meta) {
        return meta.type === BookObject.TYPE;
    }

    /**
     * @private
     */
    isSection(meta) {
        return meta.type === SectionObject.TYPE;
    }
}