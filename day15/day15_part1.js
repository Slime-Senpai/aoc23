const fs = require('fs');

const inputText = fs.readFileSync('./day15_input.txt', { encoding: 'utf-8' });

const steps = inputText.split(',');

let sum = 0;
for (const step of steps) {
	let localSum = 0;
	for (const char of step) {
		localSum += char.charCodeAt(0);
		localSum *= 17;
		localSum %= 256;
	}
	console.log(localSum);
	sum += localSum;
}
console.log(sum);
