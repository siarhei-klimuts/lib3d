/** @module lib3d*/

import * as camera from './camera';
import * as locator from './locator';
import * as mouse from './mouse';
import * as preview from './preview';
import * as selector from './selector';
import * as navigation from './navigation';
import * as factory from './factory';
import * as repository from './repository';
import * as events from './events';

export {default as ShelfObject} from './models/ShelfObject';
export {default as BookObject} from './models/BookObject';
export {default as SectionObject} from './models/SectionObject';
export {default as SelectorMeta} from './models/SelectorMeta';
export {default as SelectorMetaDto} from './models/SelectorMetaDto';

export {
	camera,
	locator,
	mouse,
	preview,
	selector,
	navigation,
	factory,
	events
};

export {
	init,
	setSize, 
	addLoop, 
	setLibrary, 
	getLibrary, 
	renderer
} from './environment';

export {
	onMouseDown,
	onMouseUp,
	onMouseMove
} from 'controls';

export {loadLibrary} from './loader';

requireAll(require.context('./objects/books/', true, /\.js$/))
	.forEach(book => repository.registerBook(book.default));

requireAll(require.context('./objects/sections/', true, /\.js$/))
	.forEach(section => repository.registerSection(section.default));

requireAll(require.context('./objects/libraries/', true, /\.js$/))
	.forEach(library => repository.registerLibrary(library.default));

function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}