const fs = require('fs');

const inputText = fs.readFileSync('./day11_input.txt', { encoding: 'utf-8' });

const lines = inputText.split('\n').map((e) => e.split(''));

let exCols = new Array(lines[0].length).fill(true);
let exRows = new Array(lines.length).fill(true);
for (let i = 0; i < lines.length; i++) {
	for (let j = 0; j < lines[i].length; j++) {
		const currChar = lines[i][j];

		if (currChar === '#') {
			exCols[j] = false;
			exRows[i] = false;
		}
	}
}

const expanded = lines.flatMap((e, i) => {
	const expE = e.flatMap((f, j) => {
		return exCols[j] ? [f, f] : [f];
	});
	return exRows[i] ? [expE, expE] : [expE];
});

const galaxies = [];
let id = 0;
for (let i = 0; i < expanded.length; i++) {
	const line = expanded[i];
	for (let j = 0; j < line.length; j++) {
		const point = line[j];

		if (point === '#') {
			galaxies.push({
				id: id++,
				x: i,
				y: j
			});
		}
	}
}

let sum = 0;
let done = [];
let pairs = 0;
for (const galaxy of galaxies) {
	for (const otherGalaxy of galaxies) {
		let cacheId = Math.min(galaxy.id, otherGalaxy.id) + '-' + Math.max(galaxy.id, otherGalaxy.id);
		if (galaxy === otherGalaxy || done.includes(cacheId)) {
			continue;
		}
		sum += Math.abs(galaxy.x - otherGalaxy.x) + Math.abs(galaxy.y - otherGalaxy.y);
		pairs++;
		done.push(cacheId);
	}
}

console.log(pairs, sum);
