import ModelData from './ModelData';

const IMAGES = ['map', 'bumpMap', 'specularMap', 'img'];

export default class BookData extends ModelData {
	constructor(data) {
		super(data, IMAGES);
	}

    get map() {
        return this._loadedData.map;
    }

    get bumpMap() {
        return this._loadedData.bumpMap;
    }

    get specularMap() {
        return this._loadedData.specularMap;
    }
}