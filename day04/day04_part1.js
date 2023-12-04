const fs = require('fs');

const inputText = fs.readFileSync('./day04_input.txt', { encoding: 'utf-8' });

const inputArray = inputText.split('\n');

const nums = inputArray.map((e) =>
	e
		.split(':')[1]
		.split('|')
		.map((e) => e.trim().split(/\s+/))
);

let sum = 0;
for (let [wins, draws] of nums) {
	let winningNumber = draws.filter((e) => wins.includes(e)).length - 1;
	sum += winningNumber >= 0 ? 2 ** winningNumber : 0;
}

console.log(sum);
