import ModelData from './ModelData';

export default class LibraryData extends ModelData {
	constructor(data, materials, textures, lights) {
		super(data);

        this._materials = materials;
        this._textures = textures;
        this._lights = lights;
	}

    get materials() {
        return this._materials;
    }

    get lights() {
        return this._lights;
    }

    getTextures(index) {
        return this._textures[index];
    }
}