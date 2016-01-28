/** @module environment
 * @description Contains all scene objects and provides easy access to them
 */
import THREE from 'three';

import * as camera from './camera';
import * as locator from './locator';
import * as cache from './cache';
import * as factory from './factory';

/** Gap between objects and paren floors */
export const CLEARANCE = 0.001;

export var scene = new THREE.Scene();
export var library = null;

var sections = {};
var books = {};

/**
 * Loads library by an object
 * @param {object} dto - full library structure
 * @returns {Promise}
 */
export function loadLibrary(dto) {
    clearScene(); // inits some fields

    var dict = parseLibraryDto(dto);

    scene.fog = new THREE.Fog(0x000000, 4, 7);
        
    sections = dict.sections;
    books = dict.books;

    return initCache(dict.sections, dict.books)
    .then(function () {
        return createLibrary(dto);
    })
    .then(function () {
        return createSections(sections);
    })
    .then(function () {
        return locator.centerObject(camera.object);
    })
    .then(function () {
        return createBooks(books);
    });
}

/**
 * @param {String} bookId - Book Id
 * @returns {lib3d.BookObject} Instance of a book
 */
export function getBook(bookId) {
    return getDictObject(books, bookId);
}

/**
 * @param {String} sectionId - Section Id
 * @returns {lib3d.SectionObject} Instance of a section
 */
export function getSection(sectionId) {
    return getDictObject(sections, sectionId);
}

/**
 * @param {String} sectionId - Section Id
 * @param {String} shelfId - Shelf Id
 * @returns {lib3d.SectionObject} Instance of a shelf
 */
export function getShelf(sectionId, shelfId) {
    var section = getSection(sectionId);
    var shelf = section && section.shelves[shelfId];

    return shelf;
}

/** Recreates section with new parameters if it has libraryId
 * or removes it if has not
 * @param {Object} dto - Section dto
 * @returns {Promise} Resolves with section dto
 */
export function updateSection(dto) {
    if(dto.libraryId == library.getId()) {
        removeSection(dto.id);
        return createSection(dto);
    } else {
        removeSection(dto.id);
        return Promise.resolve(dto);
    }
}

/** Recreates book with new parameters if there is appropriate shelf
 * or removes it if shelf is not presented in book or doesn't exist on the scene
 * @param {Object} dto - Book dto
 * @returns {Promise} Resolves with book dto if placed or true if removed
 */
export function updateBook(dto) {
    if(getBookShelf(dto)) {
        removeBook(dto.id);
        return createBook(dto);
    } else {
        removeBook(dto.id);
        return Promise.resolve(true);
    }
}

/** Removes book from the scene
 * @param {String} id - Book Id
 */
export function removeBook(id) {
    removeObject(books, id);
}

/** Removes section from the scene
 * @param {String} id - Section Id
 */
export function removeSection(id) {
    removeObject(sections, id);
}

function removeObject(dict, key) {
    var dictItem = dict[key];
    if(dictItem) {
        delete dict[key];
        
        if(dictItem.obj) {
            dictItem.obj.setParent(null);
        }
    }
}

function initCache(sectionsDict, booksDict) {
    var sectionModels = {};
    var bookModels = {};

    for (var sectionId in sectionsDict) {
        var sectionDto = sectionsDict[sectionId].dto;
        sectionModels[sectionDto.model] = true;
    }

    for (var bookId in booksDict) {
        var bookDto = booksDict[bookId].dto;
        bookModels[bookDto.model] = true;
    }

    return cache.init(sectionModels, bookModels);
}

function clearScene() {
    library = null;
    sections = {};
    books = {};

    while(scene.children.length > 0) {
        if(scene.children[0].dispose) {
            scene.children[0].dispose();
        }
        scene.remove(scene.children[0]);
    }
}

function parseLibraryDto(libraryDto) {
    var result = {
        sections: {},
        books: {}
    };

    for(var sectionIndex = libraryDto.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
        var sectionDto = libraryDto.sections[sectionIndex];
        result.sections[sectionDto.id] = {dto: sectionDto};

        for(var bookIndex = sectionDto.books.length - 1; bookIndex >= 0; bookIndex--) {
            var bookDto = sectionDto.books[bookIndex];
            result.books[bookDto.id] = {dto: bookDto};
        }

        delete sectionDto.books;
    }

    delete libraryDto.sections;

    return result;
}

function createSections(sectionsDict) {
    return createObjects(sectionsDict, createSection);
}

function createBooks(booksDict) {
    return createObjects(booksDict, createBook);
}

function createObjects(dict, factory) {
    var results = [];
    var key;

    for(key in dict) {
        results.push(factory(dict[key].dto));
    }

    return Promise.all(results);
}

function createLibrary(dto) {
    return factory.createLibrary(dto)
        .then(newLibrary => {
            library = newLibrary;
            camera.setParent(library);
            scene.add(library);
        });
}

function createSection(dto) {
    return factory.createSection(dto)
        .then(section => {
            library.add(section);
            addToDict(sections, section);

            return dto;
        });
}

function createBook(dto) {
    return factory.createBook(dto)
        .then(book => {
            addToDict(books, book);
            placeBookOnShelf(book);
        });
}

function addToDict(dict, obj) {
    var dictItem = {
        dto: obj.dataObject,
        obj: obj
    };

    dict[obj.getId()] = dictItem;
}

function getDictObject(dict, objectId) {
    var dictItem = dict[objectId];
    var dictObject = dictItem && dictItem.obj;

    return dictObject;
}

function getBookShelf(bookDto) {
    return getShelf(bookDto.sectionId, bookDto.shelfId);
}

function placeBookOnShelf(book) {
    var shelf = getBookShelf(book.dataObject);
    shelf.add(book);
}