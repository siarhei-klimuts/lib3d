import THREE from 'three';

var jsonLoader = new THREE.JSONLoader();
var _objectsRoot = 'objects';

export default class ModelData {
	constructor(data) {
		let model = jsonLoader.parse(data.model);
		let imageKeys = Object.keys(data.images);

		this._data = data;
		this._loadedData = {};
		this._materials = model.materials;
		this.geometry = model.geometry;

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

	get materials() {
		return this._materials;
	}

	getMaterialData(material) {
		return this._data.materials[material];
	}

	getImage(imageKey) {
		return this._loadedData[imageKey];
	}

	static set objectsRoot(path) {
		_objectsRoot = path;
	}

	_loadURLs(imageKeys) {
		imageKeys.forEach(key => this._loadImage(key));
	}

	_loadImage(key) {
		var url = `${_objectsRoot}/${this._data.images[key]}`;
		this._loadedData[key] = loadImage(url);
	}

	_loadDataURLs(imageKeys) {
		imageKeys.forEach(key => this._buildDataUrlImage(key));
	}

	_buildDataUrlImage(key) {
		let img = new Image();
		img.src = this._data.images[key];

		this._loadedData[key] = Promise.resolve(img);
	}
}

export function loadImage(url) {
	var img = new Image();
	img.crossOrigin = '';
	img.src = url;

	return new Promise((resolve, reject) => {
		img.onload = () => resolve(img);
		img.onerror = reject;
	});
}