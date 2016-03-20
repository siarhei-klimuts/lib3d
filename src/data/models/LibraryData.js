import THREE from 'three';
import ModelData from './ModelData';

const _DIR = 'libraries';

export default class LibraryData extends ModelData {
	constructor(data) {
		super(data);

        this._directory = _DIR;
		this._loadedData = {
			map: null,
			img: null
		};
	}
}