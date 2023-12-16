const fs = require('fs');

const inputText = fs.readFileSync('./day14_input.txt', { encoding: 'utf-8' });

const lines = inputText.split('\n');

function cycle(lines) {
	/**
	 * NORTH
	 */
	let valueOfNextRock = new Array(lines[0].length).fill(0);

	const next = new Array(lines.length).fill(0).map(() => new Array(lines[0].length).fill('.'));

	for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		const line = lines[lineNumber];
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === 'O') {
				next[valueOfNextRock[i]][i] = 'O';
				valueOfNextRock[i]++;
			} else if (char === '#') {
				next[lineNumber][i] = '#';
				valueOfNextRock[i] = lineNumber + 1;
			}
		}
	}

	/**
	 * WEST
	 */

	const next2 = new Array(lines.length).fill(0).map(() => new Array(lines[0].length).fill('.'));

	valueOfNextRock = new Array(next.length).fill(0);
	for (let lineNumber = 0; lineNumber < next.length; lineNumber++) {
		const line = next[lineNumber];
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === 'O') {
				next2[lineNumber][valueOfNextRock[lineNumber]] = 'O';
				valueOfNextRock[lineNumber]++;
			} else if (char === '#') {
				next2[lineNumber][i] = '#';
				valueOfNextRock[lineNumber] = i + 1;
			}
		}
	}

	/**
	 * SOUTH
	 */

	const next3 = new Array(lines.length).fill(0).map(() => new Array(lines[0].length).fill('.'));

	valueOfNextRock = new Array(next2[0].length).fill(next2.length - 1);
	for (let lineNumber = next2.length - 1; lineNumber >= 0; lineNumber--) {
		const line = next2[lineNumber];
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === 'O') {
				next3[valueOfNextRock[i]][i] = 'O';
				valueOfNextRock[i]--;
			} else if (char === '#') {
				next3[lineNumber][i] = '#';
				valueOfNextRock[i] = lineNumber - 1;
			}
		}
	}

	/**
	 * EAST
	 */

	const next4 = new Array(lines.length).fill(0).map(() => new Array(lines[0].length).fill('.'));

	valueOfNextRock = new Array(next3.length).fill(next3[0].length - 1);
	for (let lineNumber = 0; lineNumber < next3.length; lineNumber++) {
		const line = next3[lineNumber];
		for (let i = line.length - 1; i >= 0; i--) {
			const char = line[i];
			if (char === 'O') {
				next4[lineNumber][valueOfNextRock[lineNumber]] = 'O';
				valueOfNextRock[lineNumber]--;
			} else if (char === '#') {
				next4[lineNumber][i] = '#';
				valueOfNextRock[lineNumber] = i - 1;
			}
		}
	}

	return next4;
}
let endLines = lines;
let cached = [];

let loopValue = 0;
let startValue = 0;
for (let i = 0; i < 1000000000; i++) {
	endLines = cycle(endLines);
	endLines = endLines.map((e) => e.join(''));
	let string = endLines.reduce((a, b) => a + b, '');
	let foundStr = cached.find((e) => e.str === string);
	if (foundStr) {
		loopValue = i - foundStr.i;
		startValue = foundStr.i;
		break;
	}

	cached.push({ i: i, str: string, lines: endLines });
}

const endValue = (1000000000 - startValue) % loopValue;

endLines = cached.find((e) => e.i === endValue + startValue - 1).lines;

let sum = 0;
for (let i = 0; i < endLines.length; i++) {
	const line = endLines[i];
	for (let j = 0; j < line.length; j++) {
		const char = line[j];
		if (char === 'O') {
			sum += endLines.length - i;
		}
	}
}

console.log(sum);
