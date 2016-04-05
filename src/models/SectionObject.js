import BaseObject from './BaseObject';
import ShelfObject from './ShelfObject';

const TYPE = 'SectionObject';

export default
/** Class for sections
 * @extends BaseObject
 */
class SectionObject extends BaseObject {
    /**
     * @param {Object} params - DTO from which section is creating
     * @param {THREE.Geometry} geometry - Geometry for new section
     * @param {THREE.Material} material - Material for new section
     */
	constructor(dto, params, geometry, material) {
		super(dto, geometry, material);

		this.shelves = {};
		for(var key in params.shelves) {
			this.shelves[key] = new ShelfObject(params.shelves[key]); 
			this.add(this.shelves[key]);
		}
	}

	/** {string} 'SectionObject' */
	static get TYPE() {
		return TYPE;
	}

	/** {string} 'SectionObject' */
	get vbType() {
		return TYPE;
	}

	/**
	 * @returns {Object} New DTO from current section object state
	 */
	getDto() {
		return {
			id: this.getId(),
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z,
			rotation: [this.rotation.x, this.rotation.y, this.rotation.z]
		};
	}

	/**
	 * @param {?LibraryObject} parent - Library as new parent or null to remove
	 */
	setParent(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.libraryId = parent.getId();
			} else {
				this.parent.remove(this);
				this.dataObject.libraryId = null;
			}
		}
	}
}