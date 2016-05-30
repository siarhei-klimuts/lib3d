import ModelData from './ModelData';

export default class BookData extends ModelData {
	constructor(data) {
		super(data);
	}

    get map() {
        return this.getImage('map');
    }

    get bumpMap() {
        return this.getImage('bumpMap');
    }

    get specularMap() {
        return this.getImage('specularMap');
    }
}