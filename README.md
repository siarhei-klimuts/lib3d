[![npm version](https://badge.fury.io/js/lib3d.svg)](https://badge.fury.io/js/lib3d)
[![Codeship Status for Galiaf47/lib3d](https://img.shields.io/codeship/dac1bad0-d3da-0133-129e-1e4d5c815c8f/master.svg)](https://codeship.com/projects/142258)
[![Document](https://doc.esdoc.org/github.com/Galiaf47/lib3d/badge.svg)](https://doc.esdoc.org/github.com/Galiaf47/lib3d)
[![Coverage Status](https://coveralls.io/repos/github/Galiaf47/lib3d/badge.svg?branch=master)](https://coveralls.io/github/Galiaf47/lib3d?branch=master)

# lib3d
Display 3D library on your webpage

![Screenshot](https://raw.githubusercontent.com/Galiaf47/lib3d/master/src/img/screenshot.jpg "Screenshot")

## Install
```
npm install lib3d
```
Add three.js and lib3d to your `index.html`:
```html
<script src="/node_modules/three/three.min.js"></script>
<script src="/node_modules/lib3d/dist/lib3d.js"></script>
```
And add a canvas element to your page
```html
<body>
    <canvas id="LIBRARY"></canvas>
```

## Basic Usage
```js
var env = new lib3d.Environment(document.getElementById("LIBRARY"), 300, 300);

var library = lib3d.factory.createLibrary({
    id: '1', 
    model: 'default'
});
var section = lib3d.factory.createSection({
    id: '1', 
    model: 'default'
});
var book = lib3d.factory.createBook({
    id: '1'
    model: 'default', 
    shelfId: '4', 
    sectionId: '1'
});

library.addSection(section);
library.addBook(book);
env.library = library;

section.move(new THREE.Vector3(-0.3, 0, -2));
book.move(new THREE.Vector3(-0.1, -0.06, -0.046));
```

## Documentation
[API reference](http://galiaf47.github.io/lib3d/)

## Contribution
Star this repository or let me know in any other way that you use or going to use this library.