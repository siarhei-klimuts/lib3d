/** @module loader
 * @description Loads whole library
 */

import * as cache from './cache';
import * as factory from './factory';

/**
 * Loads library by an dto object
 * @param {object} dto - full library structure
 * @returns {Promise} Resolves with an instance of LibraryObject
 */
export function loadLibrary(dto) {
    var dict = parseLibraryDto(dto);
    var library;

    return initCache(dict.sections, dict.books)
        .then(function () {
            return factory.createLibrary(dto);
        })
        .then(function (library) {
            return createSections(library, dict.sections);
        })
        .then(function (library) {
            return createBooks(library, dict.books);
        });
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

function createSections(library, sectionsDict) {
    return createObjects(sectionsDict, factory.createSection)
        .then(results => {
            results.forEach(section => library.addSection(section));
            return library;
        });
}

function createBooks(library, booksDict) {
    return createObjects(booksDict, factory.createBook)
        .then(results => {
            results.forEach(book => library.addBook(book));
            return library;
        });
}

function createObjects(dict, factory) {
    var results = [];
    var key;

    for(key in dict) {
        results.push(factory(dict[key].dto));
    }

    return Promise.all(results);
}