import THREE from 'three';
import * as repository from 'repository';

var jsonLoader = new THREE.JSONLoader();

export default class BookData {
	constructor(data) {
		this._data = data;
		this._isLoaded = false;

		this.geometry = jsonLoader.parse(data.model).geometry;
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

	get asyncData() {
		return this._isLoaded ?
			Promise.resolve(this.getData()) :
			Promise.all([
				repository.loadImage(this._data.map),
				repository.loadImage(this._data.bumpMap),
				repository.loadImage(this._data.specularMap),
				repository.loadImage(this._data.img)
			])
			.then(results => this.saveLoadResults(results))
			.then(() => this.getData());
	}

	saveLoadResults(results) {
		//TODO: avoid multiple save
		this._map = results[0];
		this._bumpMap = results[1];
		this._specularMap = results[2];
		this._img = results[3];

		this._isLoaded = true;
	}

	getData() {
		return {
			map: this._map,
			bumpMap: this._bumpMap,
			specularMap: this._specularMap,
			img: this._img
		};
	}
}