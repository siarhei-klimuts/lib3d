import BookData from 'data/models/BookData';
import * as repository from 'repository';

import model from './model.json';

import map from './map.png';
import bumpMap from './bump_map.png';
import specularMap from './specular_map.png';
import img from './img.jpg';

function register() {
    var book = new BookData({
        name: 'default',
        isDataURLs: true,
        model,
        images: {
            map,
            img,
            bumpMap,
            specularMap
        }
    });

    repository.registerBook(book);
}

export default {
    register: register
};