const fs = require('fs');

const inputText = fs.readFileSync('./day01_input.txt', { encoding: 'utf-8' });

console.log(
	inputText
		.split('\n')
		.map(
			(e) =>
				e.split('').find((f) => !isNaN(+f)) +
				e
					.split('')
					.reverse()
					.find((f) => !isNaN(+f))
		)
		.reduce((a, b) => +a + +b, 0)
);
