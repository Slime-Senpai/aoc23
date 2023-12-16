const fs = require('fs');

const inputText = fs.readFileSync('./day15_input.txt', { encoding: 'utf-8' });

const steps = inputText.split(',');

let boxes = new Array(256).fill(0).map((e) => new Map());
for (const step of steps) {
	let box = 0;
	let operation = '';
	let focalStrength = 0;
	let label = '';
	for (const char of step) {
		if ('=-'.includes(char)) {
			operation = char;
			continue;
		} else if ('0123456789'.includes(char)) {
			focalStrength = +char;
			continue;
		}
		label += char;
		box += char.charCodeAt(0);
		box *= 17;
		box %= 256;
	}
	switch (operation) {
		case '=':
			boxes[box].set(label, focalStrength);
			break;
		case '-':
			boxes[box].delete(label);
			break;
	}
}

let sum = 0;

for (let i = 0; i < boxes.length; i++) {
	const box = boxes[i];
	if (box.size === 0) {
		continue;
	}

	for (let j = 0; j < box.size; j++) {
		// This abuses the fact that the map remembers the order insertion of the keys and uses that to order them
		const boxArray = [...box.values()];
		const strength = boxArray[j];
		sum += (i + 1) * (j + 1) * strength;
	}
}

console.log(sum);
