import THREE from 'three';

import LibraryData from 'data/models/LibraryData';
import * as repository from 'repository';

import model from './model/model.json';

import wall from './img/map.png';
import img from './img/img.jpg';

var params = {
    name: 'default',
    isDataURLs: true,
    model: model,
    images: {
        wall,
        img
    }
};

var textures = {
    Wall: {
        map: 'wall'
    }
};

var lights = [
    new THREE.AmbientLight(0x888888),
    new THREE.PointLight(0x888888, 1.3, 10)
];
lights[1].position.set(0, 2, 0);

var boundingBox = {
    center: new THREE.Vector3(0, 1.15, 0),
    radius: new THREE.Vector3(4, 1.15, 4)
};

function register() {
    var libraryData = new LibraryData(params, textures, lights, boundingBox);
    repository.registerLibrary(libraryData);
}

export default {
    register
};