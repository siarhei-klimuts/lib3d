import ModelData from './ModelData';

export default class SectionData extends ModelData {
	constructor(data, params) {
		super(data);
		this._params = params;
	}

    get map() {
        return this._loadedData.map;
    }

	get params() {
		return this._params;
	}
}