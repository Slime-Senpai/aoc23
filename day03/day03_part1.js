const fs = require('fs');

const inputText = fs.readFileSync('./day03_input.txt', { encoding: 'utf-8' });

const inputArray = inputText.split('\n').map((e) => e.split(''));

const checkedArray = Array(inputArray.length)
	.fill(0)
	.map((_, i) => new Array(inputArray[i].length).fill(false));

let sumOfNums = 0;
for (let i = 0; i < inputArray.length; i++) {
	for (let j = 0; j < inputArray[i].length; j++) {
		const part = inputArray[i][j];

		// Not a number, but not a .
		if (part != '.' && isNaN(part)) {
			for (let x = i - 1; x <= i + 1; x++) {
				for (let y = j - 1; y <= j + 1; y++) {
					const potentialNumber = inputArray[x][y];

					if (potentialNumber != '.' && !isNaN(potentialNumber) && !checkedArray[x][y]) {
						const extractedNumber = extractNumber(inputArray, x, y, checkedArray);

						sumOfNums += extractedNumber;
					}
				}
			}
		}
	}
}

console.log(sumOfNums);

function extractNumber(array, x, y, checkedArray) {
	const figures = [];

	let currY = y;

	// We get the figures from y to the start of the number
	while (!isNaN(array[x][currY])) {
		figures.unshift(array[x][currY]);
		checkedArray[x][currY] = true;
		currY--;
	}

	currY = y + 1;

	// We get the figures after y
	while (!isNaN(array[x][currY])) {
		figures.push(array[x][currY]);
		checkedArray[x][currY] = true;
		currY++;
	}

	return +figures.join('');
}
