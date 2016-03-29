import * as loader from 'loader';
import * as THREE from 'three';

describe('loader.js', function() {
	var libraryDto = {
		id: '1',
		model: 'default',
		sections: [
			{
				id: '11',
				model: 'default',
				pos_x: 1,
				pos_y: 2,
				pos_z: 3,
				books: [
					{
						id: '111',
						model: 'default',
						sectionId: '11',
						shelfId: '1',
						pos_x: 0.1,
						pos_y: 0.2,
						pos_z: 0.3,
						cover: {
							id: '1111',
							url: 'http://res.cloudinary.com/galiaf/image/upload/v1429344169/vb/books/covers/r1jwbbfqqtu1jf0vtxj5.jpg'
						}
					},
					{
						id: '222',
						model: 'default',
						sectionId: '11',
						shelfId: '2',
						pos_x: 0.3,
						pos_y: 0.2,
						pos_z: 0.1
					}
				]
			},
			{
				id: '22',
				model: 'default',
				pos_x: 4,
				pos_y: 5,
				pos_z: 6
			}
		]
	};

	it('should not load empty dto library', function() {
		let library = loader.loadLibrary();
		expect(library).toBeNull();
	});

	it('should load empty library', function() {
		let dto = {};
		let library = loader.loadLibrary(dto);

		expect(library).not.toBeNull();
		expect(library.dataObject).toBe(dto);
		expect(library.children.length).toBe(1);
		expect(library.children[0].type).toBe('AmbientLight');
	});

	it('should load library with empty section', function() {
		let sectionDto = {};
		let library = loader.loadLibrary({
			sections: [sectionDto]
		});

		expect(library.children.length).toBe(2);
	});

	it('should load full library', function() {
		let library = loader.loadLibrary(libraryDto);
		let section1 = library.getSection('11');
		let section2 = library.getSection('22');
		let book1 = library.getBook('111');
		let book2 = library.getBook('222');

		expect(library.getId()).toBe('1');
		expect(library.dataObject.model).toBe('default');
		expect(library.children.length).toBe(3);
		expect(library.children[0].type).toBe('AmbientLight');

		expect(section1.getId()).toBe('11');
		expect(section1.dataObject.model).toBe('default');
		expect(section1.position).toEqual(new THREE.Vector3(1, 2, 3));

		expect(section2.getId()).toBe('22');
		expect(section2.dataObject.model).toBe('default');
		expect(section2.position).toEqual(new THREE.Vector3(4, 5, 6));

		expect(book1.getId()).toBe('111');
		expect(book1.parent.getId()).toBe('1');
		expect(book1.dataObject.model).toBe('default');
		expect(book1.position).toEqual(new THREE.Vector3(0.1, 0.2, 0.3));
	});
});