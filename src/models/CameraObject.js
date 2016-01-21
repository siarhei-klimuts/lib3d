import THREE from 'three';
import BaseObject from './BaseObject';

const HEIGTH = 1.5;

export default class CameraObject extends BaseObject {
	constructor(camera) {
		var geometry = new THREE.Geometry();
		geometry.boundingBox = new THREE.Box3(
			new THREE.Vector3(-0.1, -1, -0.1), 
			new THREE.Vector3(0.1, 1, 0.1)
		);

		super(null, geometry);

		this.rotation.order = 'YXZ';
		this.position.y = HEIGTH;
		this.add(new THREE.PointLight(0x665555, 1.6, 10));
		this.add(camera);
	}
	
	updateBoundingBox() {
		var radius = {
			x: this.geometry.boundingBox.max.x, 
			y: this.geometry.boundingBox.max.y, 
			z: this.geometry.boundingBox.max.z
		};

		this.boundingBox = {
			radius: radius,
			center: this.position //TODO: needs center of section in parent or world coordinates
		};
	}
}