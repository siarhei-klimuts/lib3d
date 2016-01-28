import * as repository from './repository';

var sections = {};
var books = {};

export function init(sectionModels, bookModels) {
	var sectionsLoad = [];
	var booksLoad = [];
	var model; // iterators

	for (model in sectionModels) {
		sectionsLoad.push(addSection(model));
	}

	for (model in bookModels) {
		booksLoad.push(addBook(model));
	}

	return Promise.all([
		Promise.all(sectionsLoad), 
		Promise.all(booksLoad)
	]);
}

export function getSection(model) {
	return commonGetter(sections, model, addSection);
}

export function getBook(model) {
	return commonGetter(books, model, addBook);
}

function addSection(model) {
	return commonAdder(sections, model, repository.loadSectionData);
}

function addBook(model) {
	return commonAdder(books, model, repository.loadBookData);
}

function commonGetter(from, key, addFunction) {
	var result = from[key];

	if(!result) {
		result = addFunction(key);
	}

	return Promise.resolve(result);
}

function commonAdder(where, what, loader) {
	var promise = loader(what).then(function (loadedCache) {
		where[what] = loadedCache;

		return loadedCache;
	});

	return promise;
}