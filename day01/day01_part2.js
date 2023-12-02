const fs = require('fs');

const inputText = fs.readFileSync('./day01_input.txt', { encoding: 'utf-8' });

const textNumbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const lines = inputText.split('\n');

const splitLines = lines.map((e) => e.split(''));

const firstNumbers = splitLines.map((line, lineIndex) => {
	for (let i = 0; i < line.length; i++) {
		const e = line[i];
		const textNumber = textNumbers.findIndex((num) => {
			return lines[lineIndex].substring(0, i).includes(num);
		});

		if (textNumber != -1) {
			return textNumber + 1;
		}

		if (!isNaN(+e)) {
			return +e;
		}
	}
});

const lastNumbers = splitLines.map((line, lineIndex) => {
	for (let i = line.length - 1; i >= 0; i--) {
		const e = line[i];

		const textNumber = textNumbers.findIndex((num) => {
			return lines[lineIndex].substring(i).includes(num);
		});

		if (textNumber != -1) {
			return textNumber + 1;
		}

		if (!isNaN(+e)) {
			return +e;
		}
	}
});

console.log(firstNumbers.map((e, i) => +`${e}${lastNumbers[i]}`).reduce((a, b) => a + b, 0));
