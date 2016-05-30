import ModelData from 'data/models/ModelData';
import BookData from 'data/models/BookData';
import SectionData from 'data/models/SectionData';
import LibraryData from 'data/models/LibraryData';

const DEFAULT_MODEL_NAME = 'default';

var books = new Map();
var sections = new Map();
var libraries = new Map();

export function getBookData(model = DEFAULT_MODEL_NAME) {
    return books.get(model);
}

export function getSectionData(model = DEFAULT_MODEL_NAME) {
    return sections.get(model);
}

export function getLibraryData(model = DEFAULT_MODEL_NAME) {
    return libraries.get(model || DEFAULT_MODEL_NAME);
}

/** Registers external book model
 * @alias module:lib3d.registerBook
 * @param {ModelData} bookData - Book model data
 */
export function registerBook(bookData) {
    books.set(bookData.name, bookData);
}

/** Registers external section model
 * @alias module:lib3d.registerSection
 * @param {ModelData} sectionData - Section model data
 */
export function registerSection(sectionData) {
    sections.set(sectionData.name, sectionData);
}

/** Registers external library model
 * @alias module:lib3d.registerLibrary
 * @param {ModelData} libraryData - Library model data
 */
export function registerLibrary(libraryData) {
    libraries.set(libraryData.name, libraryData);
}

/** Sets path to object models
 * @alias module:lib3d.setObjectsRoot
 * @param {string} path - Path to object models
 */
export function setObjectsRoot(path) {
    ModelData.objectsRoot = path;
}