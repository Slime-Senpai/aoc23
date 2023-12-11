const fs = require('fs');

const inputText = fs.readFileSync('./day10_input.txt', { encoding: 'utf-8' });

const NORTH = [-1, 0];
const EAST = [0, 1];
const SOUTH = [1, 0];
const WEST = [0, -1];

const ORDER_OF_SIDES = [NORTH, EAST, SOUTH, WEST];

const nbColumn = inputText.indexOf('\n');
const nbRow = inputText.split('\n').length;

/**
 * [row][column]
 */
const tileMap = inputText.split('\n').map((e, i) => {
	return e.split('').map((f, j) => {
		switch (f) {
			case '|':
				return toTile(i, j, 'P', NORTH, SOUTH);
			case '-':
				return toTile(i, j, 'P', EAST, WEST);
			case 'L':
				return toTile(i, j, 'P', NORTH, EAST);
			case 'J':
				return toTile(i, j, 'P', NORTH, WEST);
			case 'F':
				return toTile(i, j, 'P', SOUTH, EAST);
			case '7':
				return toTile(i, j, 'P', SOUTH, WEST);
			case '.':
				// We'll consider that ground can't connect to anything
				return toTile(i, j, 'G');
			case 'S':
				// There are only 2 pipes that connect to the start, so we can just assume that start is true for all and filter on the ones that are possible
				return toTile(i, j, 'S', NORTH, EAST, SOUTH, WEST);
			default:
				throw new Error('Unknown type in the input file:', f, 'at index: ', i, j);
		}
	});
});

const start = tileMap.flat().find((e) => e.t === 'S');

// Since we don't know which pipes to go next, we first clean the start next pipes
start.nextPipes = start.nextPipes.filter(([x, y]) => {
	return tileMap[x][y].nextPipes.some(([x2, y2]) => x2 === start.x && y2 === start.y);
});

// Now our loop should be cleaned, so we can just iterate and count
let steps = 0;
// We'll start randomly in one direction
let currPipe = tileMap[start.nextPipes[0][0]][start.nextPipes[0][1]];

// Now we'll count the steps until we reach start again
// We could go faster by going both ways and meeting in the middle, but I'll just go from there
let lastPipe = start;
while (currPipe !== start) {
	steps++;
	// We should only have one, so we can use find and not filter
	const [x, y] = currPipe.nextPipes.find(([x, y]) => x !== lastPipe.x || y != lastPipe.y);
	lastPipe = currPipe;
	currPipe = tileMap[x][y];
}

console.log(steps, Math.ceil(steps / 2));

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {'P' | 'S' | 'G'} type
 * @param {...number[]} sides
 */
function toTile(x, y, type, ...sides) {
	return {
		sides: sides,
		x: x,
		y: y,
		t: type,
		nextPipes: sides.map((e) => [x + e[0], y + e[1]]).filter(([x, y]) => x >= 0 && y >= 0 && x < nbRow && y < nbColumn)
	};
}
