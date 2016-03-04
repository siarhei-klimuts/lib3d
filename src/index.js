/** @module lib3d*/

import * as camera from './camera';
import * as locator from './locator';
import * as mouse from './mouse';
import * as preview from './preview';
import * as selector from './selector';
import * as navigation from './navigation';
import * as factory from './factory';

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
	factory
};

export {
	init,
	setSize, 
	addLoop, 
	setLibrary, 
	getLibrary, 
	renderer
} from './environment';

export {loadLibrary} from './loader';