import THREE from 'three';

import * as camera from 'camera';
import * as mouse from 'mouse';

const KEY = 1;
const MOUSE_DOWN_EVENT = {
	which: KEY,
	offsetX: 5,
	offsetY: 6
};
const MOUSE_MOVE_EVENT = {
	offsetX: 12,
	offsetY: 14	
};
const WIDTH = 100;
const HEIGHT = 200;

describe('mouse.js', function() {
	it('should calculate mouse state on mouse events', function() {
		camera.setSize(WIDTH, HEIGHT);
		mouse.down(MOUSE_DOWN_EVENT);

		expect(mouse.keys[KEY]).toBe(true);
		expect(mouse.longX).toBe(WIDTH * 0.5 - 5);
		expect(mouse.longY).toBe(HEIGHT * 0.5 - 6);

		mouse.move(MOUSE_MOVE_EVENT);

		expect(mouse.dX).toBe(7);
		expect(mouse.dY).toBe(8);
		expect(mouse.longX).toBe(WIDTH * 0.5 - 5);
		expect(mouse.longY).toBe(HEIGHT * 0.5 - 6);

		mouse.up(MOUSE_DOWN_EVENT);

		expect(mouse.keys[KEY]).toBe(false);
	});

	it('should find a box', function() {
		camera.setSize(100, 200);

		var scene = new THREE.Scene();
		var cube = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
		cube.position.set(0,1,-4);
		cube.name = 'test cube';
		scene.add(cube);

		mouse.down({
			which: KEY,
			offsetX: 0,
			offsetY: 0
		});
		
		var intersected = mouse.getIntersected([cube], false, [THREE.Mesh]);
		expect(intersected.object.name).toBe('test cube');
	});
});