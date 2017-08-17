import BaseObject from './BaseObject';

const TYPE = 'BookObject';

export default
/** Class for books
 * @extends BaseObject
 */
class BookObject extends BaseObject {	
    /**
     * @param {Object} dataObject - DTO from which book is creating
     * @param {THREE.Geometry} geometry - Geometry for new book
     * @param {THREE.Material} material - Material for new book
     */
	constructor(dataObject, geometry, material) {
		super(dataObject, geometry, material);
	}

	/** {string} 'BookObject' */
	static get TYPE() {
		return TYPE;
	}

	/** {string} 'BookObject' */
	get vbType() {
		return TYPE;
	}

	/**
	 * @deprecated
	 * @returns {Object} New DTO from current book object state
	 */
	getDto() {
		return {
			id: this.getId(),
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z
		};
	}

	/**
	 * @param {?ShelfObject} parent - Shelf as new parent or null to remove
	 */
	setParent(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.shelfId = parent.getId();
				this.dataObject.sectionId = parent.parent.getId();
			} else {
				this.parent.remove(this);
				this.dataObject.shelfId = null;
				this.dataObject.sectionId = null;
			}
		}
	}
}