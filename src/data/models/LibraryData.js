import THREE from 'three';

import ModelData from './ModelData';

export default class LibraryData extends ModelData {
	constructor(data) {
		super(data);

		this._loadedData = {
			map: null,
			img: null
		};
	}
}