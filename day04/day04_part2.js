const fs = require('fs');

const inputText = fs.readFileSync('./day04_input.txt', { encoding: 'utf-8' });

const inputArray = inputText.split('\n');

const nums = inputArray.map((e) =>
	e
		.split(':')[1]
		.split('|')
		.map((e) => e.trim().split(/\s+/))
);

const cards = new Array(nums.length).fill(0).map((_, i) => {
	return {
		id: i + 1
	};
});

for (let i = nums.length - 1; i >= 0; i--) {
	const [wins, draws] = nums[i];
	const card = cards[i];
	let winningNumber = draws.filter((e) => wins.includes(e)).length;

	if (winningNumber > 0) {
		card.children = cards.slice(i + 1, i + winningNumber + 1);
	} else {
		card.children = [];
	}

	card.instances = 1;
}

let sum = 0;
for (const card of cards) {
	sum += card.instances;

	card.children.forEach((e) => (e.instances += card.instances));
}

cards.forEach((e) => console.log(e.id, e.instances));

console.log(sum);
