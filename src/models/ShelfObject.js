import THREE from 'three';
import BaseObject from './BaseObject';

const TYPE = 'ShelfObject';

export default
/** Class for shelf objects
 * @extends BaseObject
 */
class ShelfObject extends BaseObject {
	/**
	 * @param {Object} params - Shelf position and size as a DTO
	 */
	constructor(params) {
		var size = params.size;	
		var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

		geometry.computeBoundingBox();
		super(params, geometry);

		this.position.set(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		
		this.material.transparent = true;
		this.material.opacity = 0;
	}

	/** {string} 'ShelfObject' */
	get vbType() {
		return TYPE;
	}

	/** {string} 'ShelfObject' */
	static get TYPE() {
		return TYPE;
	}
}