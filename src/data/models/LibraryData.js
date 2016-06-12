import ModelData from './ModelData';

export default class LibraryData extends ModelData {
	constructor(data, textures, lights) {
		super(data);

        this._textures = textures;
        this._lights = lights;
	}

    get lights() {
        return this._lights;
    }

    get textures() {
        return this._textures;
    }
}