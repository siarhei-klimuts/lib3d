import THREE from 'three';

import ModelData from './ModelData';

export default class SectionData extends ModelData {
	constructor(data) {
		super(data);

		this._params = data.data;

		this._loadedData = {
			map: null,
			img: null
		};
	}

	get params() {
		return this._params;
	}
}