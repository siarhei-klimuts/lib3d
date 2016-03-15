import THREE from 'three';

import ModelData from './ModelData';

export default class BookData extends ModelData {
	constructor(data) {
		super(data);

		this._loadedData = {
			map: null,
			bumpMap: null,
			specularMap: null,
			img: null
		};
	}
}