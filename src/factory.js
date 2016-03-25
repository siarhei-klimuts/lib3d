/**
 * @module lib3d.factory 
 * @description Builds 3d objects
 */
import THREE from 'three';

import BookMaterial from './materials/BookMaterial';
import LibraryObject from './models/LibraryObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import * as repository from './repository';

/**
 * @param {Object} dto - Library dto
 * @returns {LibraryObject} An instance of LibraryObject
 */
export function createLibrary(dto) {
    var libraryData = repository.getLibraryData(dto.model);

    if (!libraryData) {
        console.error(`Library ${dto.model} not found.`);
        return null;
    }

    return buildLibrary(libraryData, dto);
}

/**
 * @param {Object} dto - Section dto
 * @returns {SectionObject} An instance of SectionObject
 */
export function createSection(dto) {
    var sectionData = repository.getSectionData(dto.model);
    //TODO: separate params from dto
    dto.data = sectionData.params;

    if (!sectionData) {
        console.error(`Section ${dto.model} not found.`);
        return null;
    }

    return buildSection(sectionData, dto);
}

/**
 * @param {Object} dto - Book dto
 * @returns {BookObject} An instance of BookObject
 */
export function createBook(dto) {
	var bookData = repository.getBookData(dto.model);
    var book;

    if (!bookData) {
        console.error(`Book ${dto.model} not found.`);
        return null;
    }

	book = new BookObject(dto, bookData.geometry);

	Promise.all([
		bookData.asyncData,
		dto.cover ? repository.loadImage(dto.cover.url) : Promise.resolve(null)
	]).then(results => {
		book.material = new BookMaterial(results[0].map, results[0].bumpMap, results[0].specularMap, results[1]);
	});

	return book;
}

function buildLibrary(libraryData, dto) {
    var library = new LibraryObject(dto, libraryData.geometry);
    library.add(new THREE.AmbientLight(0x333333));

    libraryData.asyncData
        .then(data => {
            let texture = new THREE.Texture(data.map);
            texture.needsUpdate = true;

            library.material = new THREE.MeshPhongMaterial({map: texture});
        });

	return library;
}

function buildSection(sectionData, dto) {
    var section = new SectionObject(dto, sectionData.geometry);

    sectionData.asyncData
        .then(data => {
            let texture = new THREE.Texture(data.map);
            texture.needsUpdate = true;

            section.material = new THREE.MeshPhongMaterial({map: texture});
        });

	return section;
}