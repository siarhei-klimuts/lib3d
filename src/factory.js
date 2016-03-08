/** @module factory
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
 * @returns {Promise} Resolves with an instance of LibraryObject
 */
export function createLibrary(dto) {
	return repository.loadLibraryData(dto.model)
		.then(libraryData => buildLibrary(libraryData, dto));
}

/**
 * @param {Object} dto - Section dto
 * @returns {SectionObject} an instance of SectionObject
 */
export function createSection(dto) {
    var sectionData = repository.getSectionData(dto.model);
    //TODO: separate params from dto
    dto.data = sectionData.params;

    return buildSection(sectionData, dto);
}

/**
 * @param {Object} dto - Book dto
 * @returns {BookObject} An instance of BookObject
 */
export function createBook(dto) {
	var bookData = repository.getBookData(dto.model);
	var book = new BookObject(dto, bookData.geometry);

	Promise.all([
		bookData.asyncData,
		dto.cover ? repository.loadImage(dto.cover.url) : Promise.resolve(null)
	]).then(results => {
		book.material = new BookMaterial(results[0].map, results[0].bumpMap, results[0].specularMap, results[1]);
	});

	return book;
}

function buildLibrary(libraryData, dto) {
    var texture = new THREE.Texture(libraryData.mapImage);
    var material = new THREE.MeshPhongMaterial({map: texture});
    var library;

    texture.needsUpdate = true;

	library = new LibraryObject(dto, libraryData.geometry, material);
	library.add(new THREE.AmbientLight(0x333333));

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