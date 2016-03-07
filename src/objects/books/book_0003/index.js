import BookData from 'data/models/BookData';

import model from './model.json';
import map from './map.jpg';
import bumpMap from './bump_map.jpg';
import specularMap from './specular_map.jpg';
import img from './img.jpg';

export default new BookData({
	name: 'book_0003',
	model,
	map,
	bumpMap,
	specularMap,
	img
});