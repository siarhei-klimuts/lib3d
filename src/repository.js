var books = new Map();
var sections = new Map();
var libraries = new Map();

export function getBookData(model) {
    return books.get(model);
}

export function getSectionData(model) {
    return sections.get(model);
}

export function getLibraryData(model) {
    return libraries.get(model);
}

export function loadImage(url) {
    var img = new Image();
        
    img.crossOrigin = ''; 
    img.src = url;

    return new Promise((resolve, reject) => {
    	img.onload = function() {
    		resolve(img);
    	};

    	img.onerror = function(err) {
    		reject(err);
    	};
    });
}

export function registerBook(data) {
    books.set(data.name, data);
}

export function registerSection(data) {
    sections.set(data.name, data);
}

export function registerLibrary(data) {
    libraries.set(data.name, data);
}