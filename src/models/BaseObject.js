import THREE from 'three';

export default
/** Base class for every object in a library 
 * @extends THREE.Mesh
 */
class BaseObject extends THREE.Mesh {
	/**
	 * @param {Object} dataObject - DTO from which object is creating
	 * @param {THREE.Geometry} geometry - Geometry for new object
	 * @param {THREE.Material} material - Material for new object
	 */
	constructor(dataObject, geometry, material) {
		super(geometry, material);

		this.dataObject = dataObject || {};
		this.rotation.order = 'XYZ';

		this.setDtoTransformations();
	}
	
	/** @returns {string} Object type */
	getType() {
		return this.vbType;
	}

	/** @returns {string} Id from DTO */
	getId() {
		return this.dataObject && String(this.dataObject.id);
	}

	/** Sets position and rotation from DTO */
	setDtoTransformations() {
		this.position.setX(this.dataObject.pos_x || 0);
		this.position.setY(this.dataObject.pos_y || 0);
		this.position.setZ(this.dataObject.pos_z || 0);

		if(this.dataObject.rotation) this.rotation.fromArray(this.dataObject.rotation.map(Number));

		this.updateBoundingBox();		
	}

	/** @returns {boolean} Is object outside it's parent object */
	isOutOfParrent() {
		return Math.abs(this.boundingBox.center.x - this.parent.boundingBox.center.x) > (this.parent.boundingBox.radius.x - this.boundingBox.radius.x) ||
				Math.abs(this.boundingBox.center.z - this.parent.boundingBox.center.z) > (this.parent.boundingBox.radius.z - this.boundingBox.radius.z);
	}

	/** @returns {boolean} Is object collided with other objects or it's parent object */
	isCollided() {
		var
			result,
			targets,
			target,
			i;

		this.updateBoundingBox();

		result = this.isOutOfParrent();
		targets = this.parent.children;

		if(!result) {
			for(i = targets.length - 1; i >= 0; i--) {
				target = targets[i].boundingBox;

				if(targets[i] === this ||
					!target || // children without BB
					(Math.abs(this.boundingBox.center.x - target.center.x) > (this.boundingBox.radius.x + target.radius.x)) ||
					(Math.abs(this.boundingBox.center.y - target.center.y) > (this.boundingBox.radius.y + target.radius.y)) ||
					(Math.abs(this.boundingBox.center.z - target.center.z) > (this.boundingBox.radius.z + target.radius.z))) {	
					continue;
				}

		    	result = true;		
		    	break;
			}
		}

		return result;
	}

	/** Moves object
	 * @param {THREE.Vector3} newPosition - New object position
	 * @returns {boolean} Was object moved or not
	 */
	move(newPosition) {
		var result = false;
		var currentPosition = this.position.clone();
		
		if(newPosition.x) {
			this.position.setX(newPosition.x);

			if(this.isCollided()) {
				this.position.setX(currentPosition.x);
			} else {
				result = true;
			}
		}

		if(newPosition.z) {
			this.position.setZ(newPosition.z);

			if(this.isCollided()) {
				this.position.setZ(currentPosition.z);
			} else {
				result = true;
			}
		}

		this.position.setY(newPosition.y);

		//TODO: remove as unused
		this.changed = this.changed || result;
		this.updateBoundingBox();

		return result;
	}

	/** Rotates object
	 * @param {number} dX - Horisontal rotation size
	 * @param {number} dY - Vertical rotation size
	 * @param {boolean} isDemo - Ignore collisions if true
	 */
	rotate(dX, dY, isDemo) {
		var 
			currentRotation = this.rotation.clone(),
			result = false; 
		
		if(dX) {
			this.rotation.y += dX * 0.01;

			if(!isDemo && this.isCollided()) {
				this.rotation.y = currentRotation.y;
			} else {
				result = true;
			}
		}

		if(dY) {
			this.rotation.x += dY * 0.01;

			if(!isDemo && this.isCollided()) {
				this.rotation.x = currentRotation.x;
			} else {
				result = true;
			}
		}

		//TODO: remove as unused
		this.changed = this.changed || (!isDemo && result);
		this.updateBoundingBox();
	}

	/**
	 * Updates BoundingBox, should be called after every transformation
	 * because collisions calculation depends on it 
	 */
	updateBoundingBox() {
		var
			boundingBox,
			radius,
			center;

		this.updateMatrix();
		boundingBox = this.geometry.boundingBox.clone().applyMatrix4(this.matrix);
		
		radius = {
			x: (boundingBox.max.x - boundingBox.min.x) * 0.5,
			y: (boundingBox.max.y - boundingBox.min.y) * 0.5,
			z: (boundingBox.max.z - boundingBox.min.z) * 0.5
		};

		center = new THREE.Vector3();
		center.addVectors(boundingBox.min, boundingBox.max);
		center.multiplyScalar(0.5);

		this.boundingBox = {
			radius: radius,
			center: center
		};
	}

	/**
	 * Sets transformations from current DTO state
	 */
	rollback() {
		this.setDtoTransformations();
	}
}