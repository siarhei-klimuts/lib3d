import * as factory from './factory';

/**
 * Loads library by an dto object
 * @alias module:lib3d.loadLibrary
 * @param {object} dto - full library structure
 * @returns {LibraryObject} An instance of LibraryObject
 */
export function loadLibrary(dto) {
    var dict = parseLibraryDto(dto);
    var library = factory.createLibrary(dto);

    createSections(library, dict.sections);
    createBooks(library, dict.books);

    return library;
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

function createSections(library, sectionsDict) {
    for (var id in sectionsDict) {
        let section = factory.createSection(sectionsDict[id].dto);
        library.addSection(section);
    }
}

function createBooks(library, booksDict) {
    for (var id in booksDict) {
        let book = factory.createBook(booksDict[id].dto);   
        library.addBook(book);
    }
}