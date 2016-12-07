import Environment from 'environment';
import * as factory from 'factory';
import * as locator from 'locator';

describe('environment.js', function() {
    beforeEach(function() {
        Environment.prototype.initRenderer = function() {
            this.renderer = {
                setSize: function(w, h) {
                    this.domElement.width = w;
                    this.domElement.height = h;
                },
                render: () => {},
                domElement: {
                    width: 0,
                    height: 0
                }
            };
        }
    });

    it('should init default environment', function() {
        let env = new Environment();

        expect(env.scene).toBeTruthy();

        expect(env.renderer).toBeTruthy();
        expect(env.renderer.domElement.width).toBe(300);
        expect(env.renderer.domElement.height).toBe(300);

        expect(env.camera.width).toBe(300);
        expect(env.camera.height).toBe(300);
    });

    it('should set new size', function() {
        let env = new Environment(null, 500, 450);

        expect(env.renderer.domElement.width).toBe(500);
        expect(env.renderer.domElement.height).toBe(450);

        expect(env.camera.width).toBe(500);
        expect(env.camera.height).toBe(450);
    });

    it('should add loop', function(done) {
        let callback
        window.requestAnimationFrame = fn => callback = fn;

        let env = new Environment();
        env.addLoop(() => {done()});

        callback();
    });

    it('should set library', function() {
        let library = factory.createLibrary();
        let env = new Environment();

        spyOn(locator, 'centerObject').and.callThrough();
        env.library = library;

        expect(library.parent).toBe(env.scene);
        expect(env.library).toBe(library);
        expect(env.camera.object.parent).toBe(library);
        expect(locator.centerObject).toHaveBeenCalledTimes(1);
        expect(locator.centerObject).toHaveBeenCalledWith(library, env.camera.object);
    });

    it('should set new library', function() {
        let library = factory.createLibrary();
        let newLibrary = factory.createLibrary();

        let env = new Environment();
        env.library = library;;

        spyOn(locator, 'centerObject').and.callThrough();
        env.library = newLibrary;

        expect(library.parent).toBeFalsy();
        expect(newLibrary.parent).toBe(env.scene);
        expect(env.library).toBe(newLibrary);
        expect(env.camera.object.parent).toBe(newLibrary);
        expect(locator.centerObject).toHaveBeenCalledTimes(1);
        expect(locator.centerObject).toHaveBeenCalledWith(newLibrary, env.camera.object);
    });

    it('should unset library', function() {
        let library = factory.createLibrary();
        let centerObjectCalled = false;

        let env = new Environment();
        env.library = library;

        spyOn(locator, 'centerObject').and.callFake(() => centerObjectCalled = true);
        env.library = null;;

        expect(library.parent).toBeFalsy();
        expect(env.library).toBeFalsy();
        expect(env.camera.object.parent).toBeFalsy();
        expect(centerObjectCalled).toBe(false);
    });
});