/** @module lib3d.locator
 * @description Helper for finding free place for new objects
 */

import THREE from 'three';

import GridCalculator from './gridCalculator';
import BaseObject from './models/BaseObject';

import * as repository from './repository';
import * as config from './config';

/** Center an object on scene and avoid collisions
 *
 * @param {BaseObject} obj - an instance of BaseObject,
 * should have calculated bounding box
 */
export function centerObject(library, obj) {
	var targetBB = obj.geometry.boundingBox;
	var spaceBB = library.geometry.boundingBox;

	var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x + 0.01, 0, targetBB.max.z - targetBB.min.z + 0.01);
	var occupiedMatrix = getOccupiedMatrix(library.children, matrixPrecision, obj);
	var freePosition = getFreeMatrix(occupiedMatrix, spaceBB, targetBB, matrixPrecision);		

	obj.position.setX(freePosition.x);
	obj.position.setZ(freePosition.z);
}

/** Find free space for section in current library
 * 
 * @param {Object} sectionDto - object with model attribute
 * to find appropriate geometry
 * 
 * @returns {THREE.Vector3} free position
 */
export function placeSection(library, sectionDto) {
	var sectionData = repository.getSectionData(sectionDto.model);
	var sectionBB = sectionData.geometry.boundingBox;
	var libraryBB = library.geometry.boundingBox;
	
	return getFreePlace(library.children, libraryBB, sectionBB);
}

/** Find free space for book in provided shelf
 *
 * @param {Object} bookDto - object with model attribute
 * to find appropriate geometry
 * @param {ShelfObject} shelf - an instance of ShelfObject
 *
 * @returns {THREE.Vector3} free position
 */
export function placeBook(bookDto, shelf) {
	var bookData = repository.getBookData(bookDto.model);
	var shelfBB = shelf.geometry.boundingBox;
	var bookBB = bookData.geometry.boundingBox;

	return getFreePlace(shelf.children, shelfBB, bookBB);
}

function getFreePlace(objects, spaceBB, targetBB) {
	var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x + 0.01, 0, targetBB.max.z - targetBB.min.z + 0.01);
	var occupiedMatrix = getOccupiedMatrix(objects, matrixPrecision);
	var freePosition = getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision);

	return freePosition;
}

function getFreeMatrix(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
	var DISTANCE = 1.3;

	var xIndex;
	var zIndex;
	var position = {};
	var minPosition = {};
	var edges = GridCalculator.getEdges(spaceBB, matrixPrecision);

	for (zIndex = edges.minZCell; zIndex <= edges.maxZCell; zIndex++) {
		for (xIndex = edges.minXCell; xIndex <= edges.maxXCell; xIndex++) {
			if (!occupiedMatrix[zIndex] || !occupiedMatrix[zIndex][xIndex]) {
				position.pos = getPositionFromCells([xIndex], zIndex, matrixPrecision, spaceBB, targetBB);
				position.length = position.pos.length();

				if(!minPosition.pos || position.length < minPosition.length) {
					minPosition.pos = position.pos;
					minPosition.length = position.length;
				}

				if(minPosition.pos && minPosition.length < DISTANCE) {
					return minPosition.pos;
				}
			}
		}
	}

	return minPosition.pos;
}

function getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
	var targetCellsSize = 1;
	var freeCellsCount = 0;
	var freeCellsStart;
	var xIndex;
	var zIndex;
	var cells;
	var edges = GridCalculator.getEdges(spaceBB, matrixPrecision);

	for (zIndex = edges.minZCell; zIndex <= edges.maxZCell; zIndex++) {
		for (xIndex = edges.minXCell; xIndex <= edges.maxXCell; xIndex++) {
			if (!occupiedMatrix[zIndex] || !occupiedMatrix[zIndex][xIndex]) {
				freeCellsStart = freeCellsStart || xIndex;
				freeCellsCount++;

				if (freeCellsCount === targetCellsSize) {
					cells = range(freeCellsStart, freeCellsStart + freeCellsCount);
					return getPositionFromCells(cells, zIndex, matrixPrecision, spaceBB, targetBB);
				}
			} else {
				freeCellsCount = 0;
			}
		}
	}

	return null;
}

function range(start, end) {
	var result = [];
	var i = start;

	for (i; i < end; i++) {
		result.push(i);
	}

	return result;
}

function getPositionFromCells(cells, zIndex, matrixPrecision, spaceBB, targetBB) {
	var center = GridCalculator.cellToPos(new THREE.Vector3(cells[0], 0, zIndex), matrixPrecision);

	var offset = new THREE.Vector3();
	offset.addVectors(targetBB.min, targetBB.max);
	offset.multiplyScalar(-0.5);

	return center.add(offset).setY(getBottomY(spaceBB, targetBB));
}

function getBottomY(spaceBB, targetBB) {
	return spaceBB.min.y - targetBB.min.y + config.CLEARANCE;
}

function getOccupiedMatrix(objects, matrixPrecision, obj) {
	var result = {};
	var objectBB;
	var minKeyX;
	var maxKeyX;
	var minKeyZ;
	var maxKeyZ;
	var z, x;

	objects.forEach(function (child) {
		if(child instanceof BaseObject && child !== obj) {
			objectBB = child.boundingBox;

			minKeyX = Math.round((objectBB.center.x - objectBB.radius.x) / matrixPrecision.x);
			maxKeyX = Math.round((objectBB.center.x + objectBB.radius.x) / matrixPrecision.x);
			minKeyZ = Math.round((objectBB.center.z - objectBB.radius.z) / matrixPrecision.z);
			maxKeyZ = Math.round((objectBB.center.z + objectBB.radius.z) / matrixPrecision.z);

			for(z = minKeyZ; z <= maxKeyZ; z++) {
				result[z] = result[z] || {};

				for(x = minKeyX; x <= maxKeyX; x++) {
					result[z][x] = true;
				}
			}
		}
	});

	return result;
}