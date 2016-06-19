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
import * as config from './config';

import defaultBook from 'objects/books/default';
import defaultSection from 'objects/sections/default';
import defaultLibrary from 'objects/libraries/default';

defaultLibrary.register();
defaultSection.register();
defaultBook.register();

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
    let materials = libraryData.materials;
    let libraryTextures = libraryData.textures;
    let library = new LibraryObject(dto, libraryData.geometry, new THREE.MultiMaterial(materials));

    library.boundingBox = libraryData.boundingBox;
    if (config.IS_DEBUG) {
        let geometry = new THREE.BoxGeometry(
            library.boundingBox.radius.x * 2,
            library.boundingBox.radius.y * 2,
            library.boundingBox.radius.z * 2);
        let box = new THREE.Mesh(geometry);
        box.position.copy(library.boundingBox.center);
        library.add(new THREE.BoxHelper(box));
    }

    libraryData.lights.forEach(
        light => {
            library.add(light.clone());
            if (config.IS_DEBUG) {
                library.add(new THREE.PointLightHelper(light, 0.1)); 
            }
        }
    );
    
    materials.forEach((material, index) => {
        var textures = libraryTextures[material.name];
        if (!textures) {
            return;
        }

        material.emissive = textures.emissive;

        if (textures.map) {
            libraryData.getImage(textures.map)
                .then(img => {
                    let texture =  new THREE.Texture(img);
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.needsUpdate = true;

                    material.map = texture;
                    material.needsUpdate = true;
                })
                .catch(error => console.error('Can not load textures for:', libraryData.name));     
        }

        if (textures.bumpMap) {
            libraryData.getImage(textures.bumpMap)
                .then(img => {
                    let texture =  new THREE.Texture(img);
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.needsUpdate = true;
                    
                    material.bumpMap = texture;
                    material.bumpScale = textures.bumpScale;
                    material.needsUpdate = true;
                })
                .catch(error => console.error('Can not load textures for:', libraryData.name));     
        }
    });

	return library;
}

function buildSection(sectionData, dto) {
    var material = new THREE.MeshPhongMaterial();
    var section = new SectionObject(dto, sectionData.params, sectionData.geometry, material);

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