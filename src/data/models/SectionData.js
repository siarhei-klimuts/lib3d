import THREE from 'three';
import ModelData from './ModelData';

const _DIR = 'sections';

export default class SectionData extends ModelData {
	constructor(data) {
		super(data);

        this._directory = _DIR;
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