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

var materials = [
    //wall
    new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0
    }),
    //roof
    new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 30
    }),
    //floor
    new THREE.MeshPhongMaterial({
        color: 0xE7BE75,
        shininess: 50
    })
];

var textures = [
    {map: 'wall'}
];

var lights = [
    new THREE.AmbientLight(0x666666),
    new THREE.PointLight(0x888888, 1.3, 10)
];
lights[1].position.set(0, 2, 0);

function register() {
    var libraryData = new LibraryData(params, materials, textures, lights);
    repository.registerLibrary(libraryData);
}

export default {
    register
};