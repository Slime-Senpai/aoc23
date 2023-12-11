const fs = require('fs');

const inputText = fs.readFileSync('./day10_input.txt', { encoding: 'utf-8' });

const NORTH = [-1, 0, true];
const EAST = [0, 1, false];
const SOUTH = [1, 0, true];
const WEST = [0, -1, false];

const nbColumn = inputText.indexOf('\n');
const nbRow = inputText.split('\n').length;

/**
 * [row][column]
 */
const tileMap = inputText.split('\n').map((e, i) => {
	return e.split('').map((f, j) => {
		switch (f) {
			case '|':
				return toTile(i, j, f, 'P', NORTH, SOUTH);
			case '-':
				return toTile(i, j, f, 'P', EAST, WEST);
			case 'L':
				return toTile(i, j, f, 'P', NORTH, EAST);
			case 'J':
				return toTile(i, j, f, 'P', NORTH, WEST);
			case 'F':
				return toTile(i, j, f, 'P', SOUTH, EAST);
			case '7':
				return toTile(i, j, f, 'P', SOUTH, WEST);
			case '.':
				// We'll consider that ground can't connect to anything
				return toTile(i, j, f, 'G');
			case 'S':
				// There are only 2 pipes that connect to the start, so we can just assume that start is true for all and filter on the ones that are possible
				return toTile(i, j, f, 'S', NORTH, EAST, SOUTH, WEST);
			default:
				throw new Error('Unknown type in the input file:', f, 'at index: ', i, j);
		}
	});
});

const start = tileMap.flat().find((e) => e.t === 'S');

start.loop = true;

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

let loopTiles = [start];

while (currPipe !== start) {
	steps++;
	// We should only have one, so we can use find and not filter
	const [x, y] = currPipe.nextPipes.find(([x, y]) => x !== lastPipe.x || y != lastPipe.y);
	lastPipe = currPipe;
	currPipe.loop = true;
	loopTiles.push(currPipe);
	currPipe = tileMap[x][y];
}

// Now, we have the loop and we can prepare the map to find the places that are enclosed

// First we'll replace all the non loop parts with '.'
const flatMap = tileMap.flat();
flatMap.forEach((e) => {
	e.s = e.loop ? e.s : '.';
	e.t = e.loop ? e.t : 'G';
});

// Now, since we can squeeze between pipes, we'll add artificial rows and columns of '.' to be able to account for that
const increasedMap = tileMap.flatMap((e) => [
	e.flatMap((f) => [f, toTile(0, 0, '.', 'G')]),
	new Array(nbColumn * 2).fill(0).map((_) => toTile(0, 0, '.', 'G'))
]);

// We need to reset all the tiles with their x and y to the good positions
const cleanedMap = increasedMap.map((row, x) => {
	return row.map((e, y) => {
		// We keep them the same object to be able to use tileMap later
		e.x = x;
		e.y = y;
		e.nextPipes = e.sides.map((e) => [x + e[0], y + e[1], e[2]]).filter(([x, y]) => x >= 0 && y >= 0 && x < nbRow * 2 && y < nbColumn * 2);

		return e;
	});
});

// We again need to clean the start, so big old copy paste
start.nextPipes = start.nextPipes.filter(([x, y]) => {
	return tileMap[x][y].nextPipes.some(([x2, y2]) => x2 === start.x && y2 === start.y);
});

// Now, we need to add the - and | in between the pipes from the loop
loopTiles.forEach((e) => {
	e.nextPipes.forEach(([x, y, isVertical]) => {
		if (cleanedMap[x][y].t === 'G') {
			if (isVertical) {
				cleanedMap[x][y] = toTile(x, y, '|', 'P', NORTH, SOUTH);
			} else {
				cleanedMap[x][y] = toTile(x, y, '-', 'P', EAST, WEST);
			}
		}
	});
});

// And now, we have a bigger map where we can try and find the tiles that can escape
const flatCleaned = cleanedMap.flat();
const toVisit = flatCleaned.filter((e) => e.t === 'G');

while (toVisit.length > 0) {
	// We take one
	let current = toVisit.shift();
	if (current.canGetOut !== undefined) {
		continue;
	}
	let visited = [];
	let availableMoves = [...getPossibleMoves(current, cleanedMap)];

	let canEscape = false;
	while (availableMoves.length > 0) {
		// A little condition to test if we can get out
		if (
			canEscape === false &&
			(availableMoves.some((e) => e.canGetOut === true) ||
				current.x === 0 ||
				current.y === 0 ||
				current.x === cleanedMap.length ||
				current.y === cleanedMap[current.x].length - 1)
		) {
			canEscape = true;
		}
		visited.push(current);
		current = availableMoves.shift();
		availableMoves.push(
			...getPossibleMoves(current, cleanedMap).filter((e) => !availableMoves.includes(e) && !visited.includes(e) && e.canGetOut === undefined)
		);
	}

	visited.forEach((e) => {
		if (e.canGetOut === undefined) {
			e.canGetOut = canEscape;
			e.s = canEscape ? 'X' : 'N';
		}
	});
}

// Funny console log
// console.log(
// 	tileMap
// 		.map((e) =>
// 			e
// 				.map((f) => {
// 					switch (f.s) {
// 						case 'N':
// 							return `\x1B[32m${f.s}\x1B[0m`;
// 						case 'X':
// 							return `\x1B[31m${f.s}\x1B[0m`;
// 						default:
// 							return f.s;
// 					}
// 				})
// 				.join('')
// 		)
// 		.join('\n')
// );

// Jimp to make a funny image cause why not
// const Jimp = require('jimp');

// const jimpRed = Jimp.rgbaToInt(255, 0, 0, 255);
// const jimpGreen = Jimp.rgbaToInt(0, 255, 0, 255);
// const jimpGrey = Jimp.rgbaToInt(150, 150, 150, 255);

// new Jimp(nbRow, nbColumn, (err, image) => {
// 	tileMap.forEach((row, i) => {
// 		row.forEach((e, j) => {
// 			let color;
// 			if (e.s === 'X') {
// 				color = jimpRed;
// 			} else if (e.s === 'N') {
// 				color = jimpGreen;
// 			} else {
// 				color = jimpGrey;
// 			}
// 			image.setPixelColor(color, i, j);
// 		});
// 	});

// 	image.write('./test.png');
// });

console.log(flatMap.filter((e) => e.canGetOut === false).length);

// Functions

/**
 *
 * @param {{sides: number[][];x: number;y: number;s: "S" | "|" | "-" | "F" | "J" | "L" | "7" | ".";t: "P" | "S" | "G";loop: boolean;canGetOut: boolean;nextPipes: number[][];}} tile
 * @param {tile[][]} map
 */
function getPossibleMoves(tile, map) {
	const moves = [
		[tile.x - 1, tile.y],
		[tile.x, tile.y + 1],
		[tile.x + 1, tile.y],
		[tile.x, tile.y - 1]
	].filter(([x, y]) => x >= 0 && y >= 0 && x < map.length && y < map[x].length);
	const tiles = moves.map(([x, y]) => cleanedMap[x][y]);

	return tiles.filter((e) => e.t === 'G');
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {'|' | '-' | 'F' | 'J' | 'L' | '7' | '.' | 'S'} sprite
 * @param {'P' | 'S' | 'G'} type
 * @param {...number[]} sides
 */
function toTile(x, y, sprite, type, ...sides) {
	return {
		sides: sides,
		x: x,
		y: y,
		s: sprite,
		t: type,
		loop: false,
		canGetOut: undefined,
		nextPipes: sides.map((e) => [x + e[0], y + e[1], e[2]]).filter(([x, y]) => x >= 0 && y >= 0 && x < nbRow && y < nbColumn)
	};
}
