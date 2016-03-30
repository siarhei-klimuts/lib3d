import * as factory from './factory';

/**
 * Loads library by an dto object
 * @alias module:lib3d.loadLibrary
 * @param {Object} dto - full library structure
 * @returns {LibraryObject} An instance of LibraryObject
 */
export function loadLibrary(dto) {
    var library;

    if (!dto) {
        return null;
    }

    library = factory.createLibrary(dto);
    if (!library) {
        return null;
    }

    if (dto.sections) {
        dto.sections.forEach(sectionDto => {
            let section = factory.createSection(sectionDto);
            library.addSection(section);
            
            if (sectionDto.books) {
                sectionDto.books.forEach(bookDto => {
                    let book = factory.createBook(bookDto);
                    library.addBook(book);
                });
            }
        });
    }

    return library;
}