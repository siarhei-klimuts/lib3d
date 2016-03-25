export default
/**
 * Object metadata for selector module created from BaseObject
 */
class SelectorMeta {
	/**
	 * @param {BaseObject} selectedObject - Origin object
	 */
	constructor(selectedObject) {
		if(selectedObject) {
			this.id = selectedObject.getId();
			this.parentId = selectedObject.parent.getId();
			this.type = selectedObject.getType();
		}
	}

	/** @returns {boolean} True if metadata created without origin object */
	isEmpty() {
		return !this.id;
	}

	/** 
	 * @param {SelectorMeta} meta - Metadata to compare
	 * @returns {boolean} Origin object from target metadata matches current origin object
	 */
	equals(meta) {
		return !(!meta || 
				meta.id !== this.id || 
				meta.parentId !== this.parentId || 
				meta.type !== this.type);
	}
}