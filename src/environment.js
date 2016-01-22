import THREE from 'three';

import BookMaterial from './materials/BookMaterial';
import LibraryObject from './models/LibraryObject';
import BookObject from './models/BookObject';
import SectionObject from './models/SectionObject';

import * as camera from './camera';
import * as locator from './locator';
import * as cache from './cache';
import * as repository from './repository';

export const CLEARANCE = 0.001;

export var scene = new THREE.Scene();
export var library = null;

var sections = {};
var books = {};

export function loadLibrary(dto) {
	clearScene(); // inits some fields

	var dict = parseLibraryDto(dto);

	scene.fog = new THREE.Fog(0x000000, 4, 7);
		
	sections = dict.sections;
	books = dict.books;

	return initCache(dto, dict.sections, dict.books)
	.then(function () {
		createLibrary(dto);
		return createSections(sections);
	})
	.then(function () {
		return locator.centerObject(camera.object);
	})
	.then(function () {
		return createBooks(books);
	});
}

export function getBook(bookId) {
	return getDictObject(books, bookId);
}

export function getSection(sectionId) {
	return getDictObject(sections, sectionId);
}

export function getShelf(sectionId, shelfId) {
	var section = getSection(sectionId);
	var shelf = section && section.shelves[shelfId];

	return shelf;
}

export function updateSection(dto) {
	if(dto.libraryId == library.getId()) {
		removeSection(dto.id);
		return createSection(dto);
	} else {
		removeSection(dto.id);
		return Promise.resolve(dto);
	}
}

export function updateBook(dto) {
	if(getBookShelf(dto)) {
		removeBook(dto.id);
		return createBook(dto);
	} else {
		removeBook(dto.id);
		return Promise.resolve(true);
	}
}

export function removeBook(id) {
	removeObject(books, id);
}

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

function initCache(libraryDto, sectionsDict, booksDict) {
	var libraryModel = libraryDto.model;
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

	return cache.init(libraryModel, sectionModels, bookModels);
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

function createLibrary(libraryDto) {
	var libraryCache = cache.getLibrary();
    var texture = new THREE.Texture(libraryCache.mapImage);
    var material = new THREE.MeshPhongMaterial({map: texture});

    texture.needsUpdate = true;
	library = new LibraryObject(libraryDto, libraryCache.geometry, material);

	library.add(new THREE.AmbientLight(0x333333));
	camera.setParent(library);
	
	scene.add(library);
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

function createSection(sectionDto) {
	var promise = cache.getSection(sectionDto.model).then(function (sectionCache) {
        var texture = new THREE.Texture(sectionCache.mapImage);
        var material = new THREE.MeshPhongMaterial({map: texture});
        var section;

        texture.needsUpdate = true;
        sectionDto.data = sectionCache.data;

        section = new SectionObject(sectionDto, sectionCache.geometry, material);

		library.add(section);
		addToDict(sections, section);

		return sectionDto;
	});

	return promise;
}

function createBook(bookDto) {
	return Promise.all([
		cache.getBook(bookDto.model),
		bookDto.cover ? repository.loadImage(bookDto.cover.url) : Promise.resolve(null)
	]).then(function (results) {
		var bookCache = results[0];
		var coverMapImage = results[1];
		var material = new BookMaterial(bookCache.mapImage, bookCache.bumpMapImage, bookCache.specularMapImage, coverMapImage);
		var book = new BookObject(bookDto, bookCache.geometry, material);

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