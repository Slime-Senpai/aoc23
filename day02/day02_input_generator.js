const fs = require('fs');

const gameString = 'Game {id}: ';

const drawStrings = ['{number} red', '{number} green', '{number} blue'];

let out = '';

for (let i = 1; i <= 10; i++) {
	out += gameString.replace('{id}', i);

	let games = [];
	for (let i = 0; i < randomInt(3, 7); i++) {
		const draws = shuffle(drawStrings)
			.map((e) => {
				const number = randomInt(0, 15);

				if (number > 0) {
					return e.replace('{number}', number);
				}

				return '';
			})
			.filter((e) => e != '');

		games.push(draws.join(', '));
	}

	out += games.join('; ');

	out += '\n';
}

let n = 1;
while (fs.existsSync(`./day02_test_input${n}.txt`)) {
	n++;
}
fs.writeFileSync(`./day02_test_input${n}.txt`, out.trim(), { encoding: 'utf-8' });

/**
 *
 * @param {number} min
 * @param {number} max
 * @returns Random number between min and max
 */
function randomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

/**
 *
 * @param {[]} array
 * @returns array
 */
function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
