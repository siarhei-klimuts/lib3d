import THREE from 'three';

import * as lib3d from 'index.js';
import * as repository from 'repository';
import * as environment from 'environment';
import * as locator from 'locator';

import SectionObject from 'models/SectionObject';

describe('locator.js', function () {
	var libraryDto = {
		id: 1,
		model: 'library_0001',
		sections: [],
		userId: 1
	};

	var sectionCache = {
		geometry: new THREE.BoxGeometry(0.774968 * 2, 2.24895 + 0.0449831, 0.309278 + 0.18316),
		data: readJSON('dist/obj/sections/bookshelf_0001/data.json')
	};

	var libraryCache = {
		geometry: new THREE.BoxGeometry(4.15864 * 2, 2.33378 + 1.8178, 4.15864 * 2)
	};
	
	beforeEach(function (done) {
		libraryCache.geometry.computeBoundingBox();
		sectionCache.geometry.computeBoundingBox();

		spyOn(repository, 'loadLibraryData').and.returnValue(Promise.resolve(libraryCache));
		spyOn(repository, 'loadSectionData').and.returnValue(Promise.resolve(sectionCache));

		lib3d.init();
		lib3d.load(libraryDto).then(done, fail);
	});

	it('should fill library by sections', function (done) {
		const MAX = 74;
        var placed = 0;

		function placeSection(id) {
			var dto = {
				id: id,
				model: 'bookshelf_0001'
			};

			return locator.placeSection(dto)
				.then(position => {
                    let newDto = {
                        id: dto.id,
                        libraryId: libraryDto.id,
                        model: dto.model,
                        pos_x: position.x,
                        pos_y: position.y,
                        pos_z: position.z
                    };

					return environment.updateSection(newDto)
                        .then(() => placed++);
				});
		}

		Promise.resolve(0).then(function loop(i) {
			if (i < MAX) {
				return placeSection(i)
					.then(() => i + 1)
					.then(loop);
			}
		})
        .then(() => expect(placed).toBe(MAX), fail)
        .then(() => placeSection(MAX + 1))
        .then(fail, err => expect(err).toBe('there is no free space'))
        .then(checkSections, fail)
        .then(done, fail);

        function checkSections() {
            let library = environment.library;

    		library.children.forEach(function (section) {
                if (!(section instanceof SectionObject)) return;

    			expect(section.position.x + sectionCache.geometry.boundingBox.min.x).toBeGreaterThan(library.geometry.boundingBox.min.x);
    			expect(section.position.x + sectionCache.geometry.boundingBox.max.x).toBeLessThan(library.geometry.boundingBox.max.x);
    			expect(section.position.z + sectionCache.geometry.boundingBox.min.z).toBeGreaterThan(library.geometry.boundingBox.min.z);
    			expect(section.position.z + sectionCache.geometry.boundingBox.max.z).toBeLessThan(library.geometry.boundingBox.max.z);

    			expect(section.isOutOfParrent()).toBeFalsy();
    			expect(section.isCollided()).toBeFalsy();
    		});
        }
	});
});