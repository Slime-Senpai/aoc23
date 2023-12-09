const fs = require('fs');

const inputText = fs.readFileSync('./day08_input.txt', { encoding: 'utf-8' });

const [instructions, lines] = inputText.split('\n\n');

const paths = new Map();

const pathRegex = /(.*) = \((.*), (.*)\)/;

for (let line of lines.split('\n')) {
	const [, name, left, right] = line.match(pathRegex);

	const path = {
		name: name,
		left: left,
		right: right
	};

	paths.set(name, path);
}

let currentPath = 'AAA';
let steps = 0;
let instructionIndex = 0;

while (currentPath != 'ZZZ') {
	steps++;
	const possiblePaths = paths.get(currentPath);
	const direction = instructions.charAt(instructionIndex);

	instructionIndex = (instructionIndex + 1) % instructions.length;

	currentPath = direction === 'L' ? possiblePaths.left : possiblePaths.right;
}

console.log(steps);
