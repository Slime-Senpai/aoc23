const fs = require('fs');

const inputText = fs.readFileSync('./day02_input.txt', { encoding: 'utf-8' });

const inputLines = inputText.split('\n');

const numberOfCubes = { red: 12, green: 13, blue: 14 };

let sumOfPowers = 0;

const games = inputLines.map((e) => {
	const gameId = e.split(':')[0].split(' ')[1];
	const drawsText = e.split(':')[1].split(';');

	const maxDraws = drawsText.reduce(
		(acc, drawText) => {
			const draw = drawText.split(',').reduce((a, b) => {
				const [number, text] = b.trim().split(' ');
				a[text] = number;

				return a;
			}, {});

			if (draw.red) {
				acc.red = Math.max(acc.red, draw.red);
			}

			if (draw.blue) {
				acc.blue = Math.max(acc.blue, draw.blue);
			}

			if (draw.green) {
				acc.green = Math.max(acc.green, draw.green);
			}

			return acc;
		},
		{ red: 0, blue: 0, green: 0 }
	);

	const powerOfGame = maxDraws.red * maxDraws.green * maxDraws.blue;

	sumOfPowers += powerOfGame;
});

console.log(sumOfPowers);
