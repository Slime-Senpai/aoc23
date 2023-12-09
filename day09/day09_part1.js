const fs = require('fs');

const inputText = fs.readFileSync('./day09_input.txt', { encoding: 'utf-8' });

const histories = inputText.split('\n').map((e) =>
	e
		.trim()
		.split(/\s+/)
		.map((e) => +e)
);

const futureNumbers = histories.map((history) => {
	let layers = [history];
	let currLayer = history;
	while (layers[layers.length - 1].some((e) => e != 0)) {
		const newLayer = [];
		for (let i = 0; i < currLayer.length - 1; i++) {
			newLayer.push(currLayer[i + 1] - currLayer[i]);
		}
		currLayer = newLayer;
		layers.push(newLayer);
	}

	let lastLayer = layers.pop();
	while (layers.length > 0) {
		const currLayer = layers.pop();
		currLayer.push(currLayer[currLayer.length - 1] + lastLayer[lastLayer.length - 1]);
		lastLayer = currLayer;
	}

	return lastLayer.pop();
});

console.log(futureNumbers.reduce((a, b) => a + b, 0));
