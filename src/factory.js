/** @module factory
 * @description Builds 3d objects
 */
import THREE from 'three';

import BookMaterial from './materials/BookMaterial';
import LibraryObject from './models/LibraryObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import * as cache from './cache';
import * as repository from './repository';

/**
 * @param {Object} dto - Library dto
 * @returns {Promise} Reolves with an instance of LibraryObject
 */
export function createLibrary(dto) {
	return repository.loadLibraryData(dto.model)
		.then(libraryData => buildLibrary(libraryData, dto));
}

/**
 * @param {Object} dto - Section dto
 * @returns {Promise} Reolves with an instance of SectionObject
 */
export function createSection(dto) {
	return cache.getSection(dto.model)
		.then(sectionData => buildSection(sectionData, dto));
}

/**
 * @param {Object} dto - Book dto
 * @returns {Promise} Reolves with an instance of BookObject
 */
export function createBook(dto) {
	return Promise.all([
			cache.getBook(dto.model),
			dto.cover ? repository.loadImage(dto.cover.url) : Promise.resolve(null)
		]).then(results => buildBook(results[0], results[1], dto));
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
    var texture = new THREE.Texture(sectionData.mapImage);
    var material = new THREE.MeshPhongMaterial({map: texture});

    texture.needsUpdate = true;
    dto.data = sectionData.data;

	return new SectionObject(dto, sectionData.geometry, material);
}

function buildBook(bookData, coverMapImage, dto) {
	var material = new BookMaterial(bookData.mapImage, bookData.bumpMapImage, bookData.specularMapImage, coverMapImage);

	return new BookObject(dto, bookData.geometry, material);
}