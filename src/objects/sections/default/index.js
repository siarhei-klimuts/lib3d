import SectionData from 'data/models/SectionData';
import * as repository from 'repository';

import model from './model.json';
import data from './data.json';

import map from './map.png';
import img from './img.jpg';

function register() {
    var section = new SectionData({
        name: 'default',
        isDataURLs: true,
        model: model,
        images: {
            map: map,
            img: img
        }
    }, data);

    repository.registerSection(section);
}

export default {
    register: register
};