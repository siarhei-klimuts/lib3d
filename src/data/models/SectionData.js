import ModelData from './ModelData';

const IMAGES = ['map', 'img'];

export default class SectionData extends ModelData {
	constructor(data) {
		super(data, IMAGES);
		this._params = data.data;
	}

    get map() {
        return this._loadedData.map;
    }

	get params() {
		return this._params;
	}
}