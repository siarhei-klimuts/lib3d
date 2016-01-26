import THREE from 'three';

import * as environment from './environment';

var PLANE_ROTATION = Math.PI * 0.5;
var PLANE_MULTIPLIER = 2;
var COLOR_SELECT = 0x005533;
var COLOR_FOCUS = 0x003355;

var selectPlane;
var focusPlane;

var init = function() {
	var materialProperties = {
		map: new THREE.ImageUtils.loadTexture(require('./img/glow.png')),
		transparent: true, 
		side: THREE.DoubleSide,
		blending: THREE.AdditiveBlending,
		depthTest: false
	};

	materialProperties.color = COLOR_SELECT;
	var materialSelect = new THREE.MeshBasicMaterial(materialProperties);

	materialProperties.color = COLOR_FOCUS;
	var materialFocus = new THREE.MeshBasicMaterial(materialProperties);

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 1);

	selectPlane = new THREE.Mesh(geometry, materialSelect);
	selectPlane.rotation.x = PLANE_ROTATION;

	focusPlane = new THREE.Mesh(geometry, materialFocus);
	focusPlane.rotation.x = PLANE_ROTATION;
};

var commonHighlight = function(which, obj) {
	if(obj) {
		var width = obj.geometry.boundingBox.max.x * PLANE_MULTIPLIER;
		var height = obj.geometry.boundingBox.max.z * PLANE_MULTIPLIER;
		var bottom = obj.geometry.boundingBox.min.y + environment.CLEARANCE;
		
		which.position.y = bottom;
		which.scale.set(width, height, 1);
		obj.add(which);

		which.visible = true;
	} else {
		which.visible = false;
	}
};

export function enable(val) {
	focusPlane.visible = selectPlane.visible = val;
}

export function focus(obj) {
	commonHighlight(focusPlane, obj);
}

export function select(obj) {
	commonHighlight(selectPlane, obj);
}

init();