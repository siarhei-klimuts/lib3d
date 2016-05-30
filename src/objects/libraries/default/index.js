import LibraryData from 'data/models/LibraryData';
import * as repository from 'repository';

import model from './model.json';

import map from './map.png';
import img from './img.jpg';

function register() {
    var library = new LibraryData({
        name: 'default',
        isDataURLs: true,
        model: model,
        images: {
            map: map,
            img: img
        },
        materials: {
            default: {
                map: 'map',
                shininess: 0
            }
        }
    });

    repository.registerLibrary(library);
}

export default {
    register: register
};