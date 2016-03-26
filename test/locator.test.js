import * as lib3d from 'lib3d';
import SectionObject from 'models/SectionObject';

describe('locator.js', function () {
    var libraryDto = {
        id: 1,
        sections: [],
        userId: 1
    };

    beforeEach(function () {
        var library = lib3d.loadLibrary(libraryDto);
        lib3d.init();
        lib3d.setLibrary(library);
    });

    it('should fill library by sections', function () {
        const MAX = 74;
        var placed = 0;
        var library = lib3d.getLibrary();

        function placeSection(id) {
            let dto = {
                id: id,
                libraryId: libraryDto.id
            };
            let position = lib3d.locator.placeSection(dto);

            if (!position) {
                return false;
            }

            let newDto = {
                id: dto.id,
                libraryId: libraryDto.id,
                model: dto.model,
                pos_x: position.x,
                pos_y: position.y,
                pos_z: position.z
            };

            let section = lib3d.factory.createSection(newDto);

            library.addSection(section);
            placed++;

            return true;
        }

        for (let i = 0; i < MAX; i++) {
            expect(placeSection(i)).toBe(true);
        }
        expect(placeSection(MAX + 1)).toBe(false);
        expect(placed).toBe(MAX);

        library.children.forEach(function (section) {
            if (!(section instanceof SectionObject)) return;

            expect(section.position.x + section.geometry.boundingBox.min.x).toBeGreaterThan(library.geometry.boundingBox.min.x);
            expect(section.position.x + section.geometry.boundingBox.max.x).toBeLessThan(library.geometry.boundingBox.max.x);
            expect(section.position.z + section.geometry.boundingBox.min.z).toBeGreaterThan(library.geometry.boundingBox.min.z);
            expect(section.position.z + section.geometry.boundingBox.max.z).toBeLessThan(library.geometry.boundingBox.max.z);

            expect(section.isOutOfParrent()).toBeFalsy();
            expect(section.isCollided()).toBeFalsy();
        });
    });
});