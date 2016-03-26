import THREE from 'three';

var jsonLoader = new THREE.JSONLoader();
var _objectsRoot = 'objects';

export default class ModelData {
	constructor(data, imageKeys) {
		this._data = data;
		this._loadedData = {};
		this.geometry = jsonLoader.parse(data.model).geometry;

		if (data.isDataURLs) {
			this._loadDataURLs(imageKeys);
		} else {
			this._loadURLs(imageKeys);
		}
	}

	get name() {
		return this._data.name;
	}

	get geometry() {
		return this._geometry;
	}

	set geometry(geometry) {
		geometry.computeBoundingBox();
		this._geometry = geometry;
	}

	static set objectsRoot(path) {
		_objectsRoot = path;
	}

	_loadURLs(imageKeys) {
		imageKeys.forEach(key => this._loadImage(key));
	}

	_loadImage(key) {
		var url = `${_objectsRoot}/${this._data[key]}`;
		this._loadedData[key] = loadImage(url);
	}

	_loadDataURLs(imageKeys) {
		imageKeys.forEach(key => this._buildDataUrlImage(key));
	}

	_buildDataUrlImage(key) {
		let img = new Image();
		img.src = this._data[key];

		this._loadedData[key] = Promise.resolve(img);
	}
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