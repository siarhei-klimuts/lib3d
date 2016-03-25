import SelectorMeta from './SelectorMeta';

export default
/**
 * Object metadata for selector module created from DTO
 * @extends SelectorMeta
 */
class SelectorMetaDto extends SelectorMeta {
	/**
	 * @param {string} type - Object type
	 * @param {string} id - Origin object id
	 * @param {string} parentId - Origin object parentId
	 */
	constructor(type, id, parentId) {
		super();
		
		this.type = type;
		this.id = id;
		this.parentId = parentId;
	}
}