import ModelData from 'data/models/ModelData';
import BookData from 'data/models/BookData';
import SectionData from 'data/models/SectionData';
import LibraryData from 'data/models/LibraryData';

var books = new Map();
var sections = new Map();
var libraries = new Map();

export function getBookData(model) {
    return books.get(model);
}

export function getSectionData(model) {
    return sections.get(model);
}

export function getLibraryData(model) {
    return libraries.get(model);
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

export function loadImage(url) {
    var img = new Image();
        
    img.crossOrigin = ''; 
    img.src = url;

    return new Promise((resolve, reject) => {
    	img.onload = function() {
    		resolve(img);
    	};

    	img.onerror = function(err) {
    		reject(err);
    	};
    });
}