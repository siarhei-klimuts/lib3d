import ModelData from './ModelData';

export default class LibraryData extends ModelData {
	constructor(data, textures, lights, boundingBox) {
		super(data);

        this._textures = textures;
        this._lights = lights;
        this._boundingBox = boundingBox;
	}

    get lights() {
        return this._lights;
    }

    get textures() {
        return this._textures;
    }

    get boundingBox() {
        return this._boundingBox;
    }
}