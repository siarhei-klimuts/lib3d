import ModelData from './ModelData';

const IMAGES = ['map', 'img'];

export default class LibraryData extends ModelData {
	constructor(data) {
		super(data, IMAGES);
	}

    get map() {
        return this._loadedData.map;
    }
}