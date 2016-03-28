/**
 * @module lib3d.factory 
 * @description Builds 3d objects
 */
import THREE from 'three';

import BookMaterial from './materials/BookMaterial';
import LibraryObject from './models/LibraryObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import * as ModelData from 'data/models/ModelData';
import * as repository from './repository';

/**
 * @param {Object} [dto] - Library dto
 * @param {string} [dto.model=default] - Library model name
 * @returns {LibraryObject} Library from model specified
 * in dto.model param
 */
export function createLibrary(dto) {
    var libraryData = repository.getLibraryData(dto && dto.model);

    if (!libraryData) {
        console.error(`Library ${dto.model} not found.`);
        return null;
    }

    return buildLibrary(libraryData, dto);
}

/**
 * @param {Object} [dto] - Section dto
 * @param {string} [dto.model=default] - Section model name
 * @returns {SectionObject} Section from model specified
 * in dto.model param
 */
export function createSection(dto) {
    var sectionData = repository.getSectionData(dto && dto.model);

    if (!sectionData) {
        console.error(`Section ${dto.model} not found.`);
        return null;
    }

    //TODO: separate params from dto
    dto.data = sectionData.params;
    return buildSection(sectionData, dto);
}

/**
 * @param {Object} [dto] - Book dto
 * @param {string} [dto.model=default] - Book model name
 * @returns {BookObject} Book from model specified
 * in dto.model param
 */
export function createBook(dto) {
	var bookData = repository.getBookData(dto && dto.model);

    if (!bookData) {
        console.error(`Book ${dto.model} not found.`);
        return null;
    }

    return buildBook(bookData, dto);
}

function buildLibrary(libraryData, dto) {
    var material = new THREE.MeshPhongMaterial();
    var library = new LibraryObject(dto, libraryData.geometry, material);
    library.add(new THREE.AmbientLight(0x333333));

    libraryData.map
        .then(map => {
            library.material.map = new THREE.Texture(map);
            library.material.map.needsUpdate = true;
            library.material.needsUpdate = true;
        })
        .catch(error => console.error('Can not load textures for:', libraryData.name));

	return library;
}

function buildSection(sectionData, dto) {
    var material = new THREE.MeshPhongMaterial();
    var section = new SectionObject(dto, sectionData.geometry, material);

    sectionData.map
        .then(map => {
            section.material.map = new THREE.Texture(map);
            section.material.map.needsUpdate = true;
            section.material.needsUpdate = true;
        })
        .catch(error => console.error('Can not load textures for:', sectionData.name));

	return section;
}

function buildBook(bookData, dto) {
    var book = new BookObject(dto, bookData.geometry, new BookMaterial());

    Promise.all([
        bookData.map,
        bookData.bumpMap,
        bookData.specularMap,
        dto.cover ? ModelData.loadImage(dto.cover.url) : null
    ])
    .then(results => {
        book.material = new BookMaterial(results[0], results[1], results[2], results[3]);
    })
    .catch(error => console.error('Can not load textures for:', bookData.name));

    return book;
}