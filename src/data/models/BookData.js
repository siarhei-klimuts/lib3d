import THREE from 'three';
import ModelData from './ModelData';

const _DIR = 'books';

export default class BookData extends ModelData {
	constructor(data) {
		super(data);

        this._directory = _DIR;
		this._loadedData = {
			map: null,
			bumpMap: null,
			specularMap: null,
			img: null
		};
	}
}