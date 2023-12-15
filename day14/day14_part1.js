const fs = require('fs');

const inputText = fs.readFileSync('./day14_input.txt', { encoding: 'utf-8' });

const lines = inputText.split('\n');

let valueOfNextRock = new Array(lines[0].length).fill(lines.length);
let sum = 0;
for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
	const line = lines[lineNumber];
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === 'O') {
			sum += valueOfNextRock[i];
			valueOfNextRock[i]--;
		} else if (char === '#') {
			valueOfNextRock[i] = lines.length - lineNumber - 1;
		}
	}
}

console.log(sum);
