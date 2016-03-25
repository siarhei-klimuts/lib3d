import BaseObject from './BaseObject';

export default
/** Class for library objects to place on scene
 * @extends BaseObject
 */
class LibraryObject extends BaseObject {
    /**
     * @param {Object} params - DTO from which library is creating
     * @param {THREE.Geometry} geometry - Geometry for new library
     * @param {THREE.Material} material - Material for new library
     */
    constructor(params, geometry, material) {
        super(params, geometry, material);

        this.sections = {};
        this.books = {};
    }

    /** Adds section to a library
     * @param {SectionObject} section - Section to add
     */
    addSection(section) {
        this.add(section);
        this.addToDict(this.sections, section);
    }

    /** Adds book to a library
     * @param {BookObject} book - Book to add
     */
    addBook(book) {
        this.placeBookOnShelf(book);
        this.addToDict(this.books, book);
    }

    /** Places book on shelf specified in book's DTO
     * @param {SectionObject} section - Section to add
     */
    placeBookOnShelf(book) {
        var shelf = this.getBookShelf(book.dataObject);
        shelf.add(book);
    }

    /**
     * @param {String} sectionId - Section Id
     * @returns {SectionObject} An instance of a section
     */
    getSection(sectionId) {
        return this.getDictObject(this.sections, sectionId);
    }

    /**
     * @param {String} sectionId - Section Id
     * @param {String} shelfId - Shelf Id
     * @returns {SectionObject} An instance of a shelf
     */
    getShelf(sectionId, shelfId) {
        var section = this.getSection(sectionId);
        var shelf = section && section.shelves[shelfId];

        return shelf;
    }

    /** @private */
    getBookShelf(bookDto) {
        return this.getShelf(bookDto.sectionId, bookDto.shelfId);
    }

    /**
     * @param {String} bookId - Book Id
     * @returns {BookObject} An instance of a book
     */
    getBook(bookId) {
        return this.getDictObject(this.books, bookId);
    }

    /** Removes section from the library
     * @param {String} id - Section Id
     */
    removeSection(id) {
        this.removeObject(this.sections, id);
    }

    /** Removes book from the library
     * @param {String} id - Book Id
     */
    removeBook(id) {
        this.removeObject(this.books, id);
    }

    /** @private */
    addToDict(dict, obj) {
        var dictItem = {
            dto: obj.dataObject,
            obj: obj
        };

        dict[obj.getId()] = dictItem;
    }

    /** @private */
    getDictObject(dict, objectId) {
        var dictItem = dict[objectId];
        var dictObject = dictItem && dictItem.obj;

        return dictObject;
    }

    /** @private */
    removeObject(dict, key) {
        var dictItem = dict[key];

        if(dictItem) {
            delete dict[key];
            
            if(dictItem.obj) {
                dictItem.obj.setParent(null);
            }
        }
    }
}
