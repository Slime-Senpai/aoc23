const fs = require('fs');

const inputText = fs.readFileSync('./day16_input.txt', { encoding: 'utf-8' });

/**
 * Enum for the possible sides from which a cell can be energized
 * @readonly
 * @enum {{ x: -1, y: 0 } | { x: 0, y: 1 } | { x: 1, y: 0 } | { x: 0, y: -1 }}
 */
const Side = Object.freeze({
	NORTH: Object.freeze({ x: -1, y: 0 }),
	EAST: Object.freeze({ x: 0, y: 1 }),
	SOUTH: Object.freeze({ x: 1, y: 0 }),
	WEST: Object.freeze({ x: 0, y: -1 }),

	comingToNext(comingSide) {
		switch (comingSide) {
			case this.NORTH:
				return this.SOUTH;
			case this.EAST:
				return this.WEST;
			case this.SOUTH:
				return this.NORTH;
			case this.WEST:
				return this.EAST;
		}
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
	_values: [this.LEFT_MIRROR, this.RIGHT_MIRROR, this.EMPTY, this.HORIZONTAL_SPLITTER, this.VERTICAL_SPLITTER],

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
	type;

	x;

	y;

	/**
	 * True if the cell has been energized, false otherwise
	 * @type {boolean}
	 */
	energized = false;

	/**
	 * The sides from which the energy is coming from (will be used to stop loops)
	 * @type {Side[]}
	 */
	energizedFrom = [];

	/**
	 * Constructs a new non energized cell with given type
	 * @param {Type} type
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(type, x, y) {
		this.type = type;
		this.x = x;
		this.y = y;
	}

	/**
	 * Energizes the current cell, taking into account the side from which it was energized
	 * @param {Side} comingSide
	 */
	energize(comingSide) {
		this.energized = true;
		this.energizedFrom.push(comingSide);
	}

	reset() {
		this.energized = false;
		this.energizedFrom = [];
	}

	/**
	 * @param {Side} comingSide
	 * @returns {Side[]} The sides where the beam of energy will travel to
	 */
	getNextEnergizedSides(comingSide) {
		throw new Error('To implement');
	}
}

class HorizontalSplitter extends Cell {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(Type.HORIZONTAL_SPLITTER, x, y);
	}

	/**
	 * @param {Side} comingSide
	 * @returns {Side[]} The sides where the beam of energy will travel to
	 */
	getNextEnergizedSides(comingSide) {
		switch (comingSide) {
			case Side.NORTH:
			case Side.SOUTH:
				return [Side.EAST, Side.WEST];
			case Side.EAST:
				return [Side.WEST];
			case Side.WEST:
				return [Side.EAST];
		}
	}
}

class VerticalSplitter extends Cell {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(Type.VERTICAL_SPLITTER, x, y);
	}

	/**
	 * @param {Side} comingSide
	 * @returns {Side[]} The sides where the beam of energy will travel to
	 */
	getNextEnergizedSides(comingSide) {
		switch (comingSide) {
			case Side.EAST:
			case Side.WEST:
				return [Side.NORTH, Side.SOUTH];
			case Side.NORTH:
				return [Side.SOUTH];
			case Side.SOUTH:
				return [Side.NORTH];
		}
	}
}

class LeftMirror extends Cell {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(Type.LEFT_MIRROR, x, y);
	}

	/**
	 * @param {Side} comingSide
	 * @returns {Side[]} The sides where the beam of energy will travel to
	 */
	getNextEnergizedSides(comingSide) {
		switch (comingSide) {
			case Side.EAST:
				return [Side.SOUTH];
			case Side.WEST:
				return [Side.NORTH];
			case Side.NORTH:
				return [Side.WEST];
			case Side.SOUTH:
				return [Side.EAST];
		}
	}
}

class RightMirror extends Cell {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(Type.RIGHT_MIRROR, x, y);
	}

	/**
	 * @param {Side} comingSide
	 * @returns {Side[]} The sides where the beam of energy will travel to
	 */
	getNextEnergizedSides(comingSide) {
		switch (comingSide) {
			case Side.EAST:
				return [Side.NORTH];
			case Side.WEST:
				return [Side.SOUTH];
			case Side.NORTH:
				return [Side.EAST];
			case Side.SOUTH:
				return [Side.WEST];
		}
	}
}

class EmptyCell extends Cell {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(Type.EMPTY, x, y);
	}

	/**
	 * @param {Side} comingSide
	 * @returns {Side[]} The sides where the beam of energy will travel to
	 */
	getNextEnergizedSides(comingSide) {
		switch (comingSide) {
			case Side.EAST:
				return [Side.WEST];
			case Side.WEST:
				return [Side.EAST];
			case Side.NORTH:
				return [Side.SOUTH];
			case Side.SOUTH:
				return [Side.NORTH];
		}
	}
}

const map = inputText.split('\n').map((e, x) =>
	e.split('').map((f, y) => {
		let cell;
		switch (f) {
			case Type.EMPTY:
				cell = new EmptyCell(x, y);
				break;
			case Type.HORIZONTAL_SPLITTER:
				cell = new HorizontalSplitter(x, y);
				break;
			case Type.VERTICAL_SPLITTER:
				cell = new VerticalSplitter(x, y);
				break;
			case Type.LEFT_MIRROR:
				cell = new LeftMirror(x, y);
				break;
			case Type.RIGHT_MIRROR:
				cell = new RightMirror(x, y);
				break;
			default:
				throw new Error(`Wrong type ${f}`);
		}

		return cell;
	})
);

/**
 * @type {{cell: Cell, comingSide: Side}[]}
 */
const possibleFirstSteps = [];

// We won't assume it's a square cause I don't like that, we'll just assume it's a box so that using map[0].length is fine for all the lengths
for (let i = 0; i < map.length; i++) {
	possibleFirstSteps.push({ cell: map[i][0], comingSide: Side.WEST });
	possibleFirstSteps.push({ cell: map[i][map[i].length - 1], comingSide: Side.EAST });
}

for (let i = 0; i < map[0].length; i++) {
	possibleFirstSteps.push({ cell: map[0][i], comingSide: Side.NORTH });
	possibleFirstSteps.push({ cell: map[map.length - 1][i], comingSide: Side.SOUTH });
}

let maxEnergy = 0;
for (const firstStep of possibleFirstSteps) {
	map.forEach((e) => e.forEach((f) => f.reset()));
	/**
	 * @type {{cell: Cell, comingSide: Side}[]}
	 */
	const nextStep = [firstStep];

	while (nextStep.length > 0) {
		/**
		 * @type {{cell: Cell, comingSide: Side}}
		 */
		const { cell: currentCell, comingSide: comingSide } = nextStep.shift();
		currentCell.energize(comingSide);

		const nextSides = currentCell.getNextEnergizedSides(comingSide);
		const currX = currentCell.x;
		const currY = currentCell.y;

		const nextCells = nextSides
			.map((e) => e)
			.filter((e) => {
				return currX + e.x >= 0 && currX + e.x < map.length && currY + e.y >= 0 && currY + e.y < map[currX + e.x].length;
			})
			.map((e) => {
				return { cell: map[currX + e.x][currY + e.y], comingSide: Side.comingToNext(e) };
			})
			.filter((e) => {
				return !e.cell.energizedFrom.includes(e.comingSide);
			});

		nextStep.push(...nextCells);
	}

	const nbEnergized = map.reduce((a, b) => a + b.reduce((a, b) => a + (b.energized ? 1 : 0), 0), 0);

	maxEnergy = Math.max(maxEnergy, nbEnergized);
}

console.log(maxEnergy);
