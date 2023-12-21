const fs = require('fs');

const inputText = fs.readFileSync('./day15_input.txt', { encoding: 'utf-8' });

/**
 * Enum for the possible sides from which a cell can be energized
 * @readonly
 * @enum {-10 | 1 | 10 | -1}
 */
const Side = Object.freeze({
	NORTH: -10,
	EAST: 1,
	SOUTH: 10,
	WEST: -1,

	/**
	 * @param {1 | 0 | -1} x
	 * @param {1 | 0 | -1} y
	 * @returns {Side}
	 */
	fromXandY(x, y) {
		return x * 10 + y;
	}
});

/**
 * Enum for the possible types of a cell
 * @readonly
 * @enum {'/' | '\\' | '.' | '-' | '|'}
 */
const Type = Object.freeze({
	LEFT_MIRROR: '/',
	RIGHT_MIRROR: '\\',
	EMPTY: '.',
	HORIZONTAL_SPLITTER: '-',
	VERTICAL_SPLITTER: '|',

	/**
	 * @type {Type[]}
	 */
	_values: [LEFT_MIRROR, RIGHT_MIRROR, EMPTY, HORIZONTAL_SPLITTER, VERTICAL_SPLITTER],

	/**
	 *
	 * @param {'/' | '\\' | '.' | '-' | '|'} string
	 * @returns {Type}
	 */
	fromString(string) {
		return this._values.find((e) => e === string);
	}
});

class Cell {
	/**
	 * The type of the cell
	 * @type {Type}
	 */
	type = Type.EMPTY;
	energized = false;
	/**
	 * The sides from which the energy is coming from (will be used to stop loops)
	 * @type {Side[]}
	 */
	energizedFrom = [];

	/**
	 * Constructs a new non energized cell with given type
	 * @param {Type} type
	 */
	constructor(type) {
		this.type = type;
	}

	/**
	 * Energizes the current cell, taking into account the side from which it was energized
	 * @param {Side} comingSide
	 */
	energize(comingSide) {
		this.energized = true;
		this.energizedFrom.push(comingSide);
	}
}

const map = inputText.split('\n').map((e) =>
	e.split('').map((f) => {
		return new Cell(f);
	})
);
map[0][0].energize(Side.fromXandY(0, 1));
