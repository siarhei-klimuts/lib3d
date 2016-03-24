# lib3d
Display 3D library on your webpage

![Screenshot](https://raw.githubusercontent.com/Galiaf47/lib3d/master/src/img/screenshot.jpg "Screenshot")

## Install
```
npm install lib3d
```
Then add lib3d and dependencies to your `index.html`,
objects should be added after lib3d:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.min.js"></script>
<script src="/node_modules/lib3d/dist/lib3d.js"></script>
<script src="/node_modules/lib3d/dist/objects/libraries/library_0001/library_0001.js"></script>
<script src="/node_modules/lib3d/dist/objects/sections/bookshelf_0001/bookshelf_0001.js"></script>
<script src="/node_modules/lib3d/dist/objects/books/book_0001/book_0001.js"></script>
```
And add a canvas element to your page
```html
<canvas id="LIBRARY"></canvas>
```

## Basic Usage
```js
lib3d.init(document.getElementById("LIBRARY"), 300, 300);

var library = lib3d.factory.createLibrary({model: 'library_0001'});
var section = lib3d.factory.createSection({id: '3', model: 'bookshelf_0001'})
var book1 = lib3d.factory.createBook({
    id: '1',
    model: 'book_0001', 
    shelfId: '4', 
    sectionId: '3'
});

library.addSection(section);
library.addBook(book1);
lib3d.setLibrary(library);

section.move(new THREE.Vector3(-0.3, 0, -2));
book1.move(new THREE.Vector3(-0.1, -0.06, -0.046));
```