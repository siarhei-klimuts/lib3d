import * as environment from 'environment';
import * as camera from 'camera';
import * as factory from 'factory';
import * as locator from 'locator';

describe('environment.js', function() {
	beforeEach(function() {
        environment.setRenderer({
        	render: () => {},
        	setSize: function(w, h) {
        		this.domElement.width = w;
        		this.domElement.height = h;
        	},
        	domElement: {
        		width: 0,
        		height: 0
        	}
        });
	});

	it('should init default environment', function() {
		environment.init();

		expect(environment.scene).toBeTruthy();

		expect(environment.renderer).toBeTruthy();
		expect(environment.renderer.domElement.width).toBe(300);
		expect(environment.renderer.domElement.height).toBe(300);

		expect(camera.width).toBe(300);
		expect(camera.height).toBe(300);
	});

	it('should set new size', function() {
		environment.init(null, 500, 450);

		expect(environment.renderer.domElement.width).toBe(500);
		expect(environment.renderer.domElement.height).toBe(450);

		expect(camera.width).toBe(500);
		expect(camera.height).toBe(450);
	});

	it('should add loop', function(done) {
		let callback;
		window.requestAnimationFrame = fn => callback = fn;

		environment.init();
		environment.addLoop(() => {done()});

		callback();
	});

	it('should set library', function() {
		let library = factory.createLibrary();
		environment.init();

		spyOn(locator, 'centerObject').and.callThrough();
		environment.setLibrary(library);

		expect(library.parent).toBe(environment.scene);
		expect(environment.getLibrary()).toBe(library);
		expect(camera.object.parent).toBe(library);
		expect(locator.centerObject).toHaveBeenCalledTimes(1);
		expect(locator.centerObject).toHaveBeenCalledWith(library, camera.object);
	});

	it('should set new library', function() {
		let library = factory.createLibrary();
		let newLibrary = factory.createLibrary();

		environment.init();
		environment.setLibrary(library);

		spyOn(locator, 'centerObject').and.callThrough();
		environment.setLibrary(newLibrary);

		expect(library.parent).toBeFalsy();
		expect(newLibrary.parent).toBe(environment.scene);
		expect(environment.getLibrary()).toBe(newLibrary);
		expect(camera.object.parent).toBe(newLibrary);
		expect(locator.centerObject).toHaveBeenCalledTimes(1);
		expect(locator.centerObject).toHaveBeenCalledWith(newLibrary, camera.object);
	});

	it('should unset library', function() {
		let library = factory.createLibrary();
		let centerObjectCalled = false;

		environment.init();
		environment.setLibrary(library);

		spyOn(locator, 'centerObject').and.callFake(() => centerObjectCalled = true);
		environment.setLibrary();

		expect(library.parent).toBeFalsy();
		expect(environment.getLibrary()).toBeFalsy();
		expect(camera.object.parent).toBeFalsy();
		expect(centerObjectCalled).toBe(false);
	});
});