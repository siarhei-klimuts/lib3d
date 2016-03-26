import ModelData from 'data/models/ModelData';
import BookData from 'data/models/BookData';
import SectionData from 'data/models/SectionData';
import LibraryData from 'data/models/LibraryData';

import defaultBook from 'objects/books/default';
import defaultSection from 'objects/sections/default';
import defaultLibrary from 'objects/libraries/default';

var books = new Map();
var sections = new Map();
var libraries = new Map();

registerBook(defaultBook);
registerSection(defaultSection);
registerLibrary(defaultLibrary);

export function getBookData(model) {
    return books.get(model || defaultBook.name);
}

export function getSectionData(model) {
    return sections.get(model || defaultSection.name);
}

export function getLibraryData(model) {
    return libraries.get(model || defaultLibrary.name);
}

/** Registers external book model
 * @alias module:lib3d.registerBook
 * @param {object} data - Book model data
 */
export function registerBook(data) {
    var book = new BookData(data);
    books.set(book.name, book);
}

/** Registers external section model
 * @alias module:lib3d.registerSection
 * @param {object} data - Section model data
 */
export function registerSection(data) {
    var section = new SectionData(data);
    sections.set(section.name, section);
}

/** Registers external library model
 * @alias module:lib3d.registerLibrary
 * @param {object} data - Library model data
 */
export function registerLibrary(data) {
    var library = new LibraryData(data);
    libraries.set(library.name, library);
}

/** Sets path to object models
 * @alias module:lib3d.setObjectsRoot
 * @param {string} path - Path to object models
 */
export function setObjectsRoot(path) {
    ModelData.objectsRoot = path;
}