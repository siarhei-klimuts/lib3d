/** @module lib3d*/

import * as camera from './camera';
import * as locator from './locator';
import * as mouse from './mouse';
import * as preview from './preview';
import * as selector from './selector';
import * as navigation from './navigation';

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
	navigation
};

export {init, addLoop, setLibrary, getLibrary} from './environment';
export {loadLibrary} from './loader';