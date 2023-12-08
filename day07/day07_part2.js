const fs = require('fs');

const inputText = fs.readFileSync('./day07_input.txt', { encoding: 'utf-8' });

const strengths = 'J23456789TQKA';

const players = inputText
	.split('\n')
	.map((e) => e.trim().split(/\s+/))
	.map(arrayToPlayer);

console.log(players.sort((a, b) => a.points - b.points));

console.log(
	players
		.sort((a, b) => a.points - b.points)
		.reduce((a, b, i) => {
			console.log(b, b.bet, 'rank', i + 1, a);
			return a + b.bet * (i + 1);
		}, 0)
);

/**
 * Converts an array of [hand, bet] into a player object
 *
 * @param {string[]} array
 *
 * @returns {{hand: string, bet: number, type: number, points: number}}
 */
function arrayToPlayer(array) {
	const hand = array[0];

	const bet = array[1];

	const player = {
		hand: hand,
		bet: +bet
	};

	/* We'll pre calculate the points of each players to be able to sort them
	 * We'll use a very simple order of 7 numbers: type first then strength of card 1 to 5
	 * Because the cards are 0 to 12, we'll use one more number
	 * For example: AAAAA -> 7133332, AA8AA -> 6132932, 23332 -> 5023332
	 * We can then just use that to sort the array and use the sorting to calculate the rank
	 */

	// First we need to calculate the type, to do that we'll count each card
	const nbCards = hand
		.split('')
		.reduce((a, b) => {
			const index = strengths.indexOf(b);
			if (a[index]) {
				a[index]++;
			} else {
				a[index] = 1;
			}

			return a;
		}, [])
		.sort((a, b) => b - a);

	const nbWildcard = hand.split('').filter((e) => e === 'J').length;

	// There could have been a better way to set this, but I like this approach as it lets me change any of them later if I need to
	let type = 1;
	if (nbCards[0] === 5) {
		type = 7;
	} else if (nbCards[0] === 4) {
		type = 6;
	} else if (nbCards[0] === 3 && nbCards[1] === 2) {
		type = 5;
	} else if (nbCards[0] === 3) {
		type = 4;
	} else if (nbCards[0] === 2 && nbCards[1] === 2) {
		type = 3;
	} else if (nbCards[0] === 2) {
		type = 2;
	}
	//player.baseType = type;

	type = increaseTypeWithWildcards(type, nbWildcard);

	player.type = type;

	type *= 10 ** 12;

	player.points = hand
		.split('')
		.map((e, i) => {
			const strength = strengths.indexOf(e);

			return strength * 10 ** (8 - 2 * i);
		})
		.reduce((a, b) => {
			return a + b;
		}, type);

	return player;
}

/**
 *
 * @param {number} type The current type
 * @param {number} nbWildcard The number of wildcards
 */
function increaseTypeWithWildcards(type, nbWildcard) {
	if (nbWildcard === 0) {
		return type;
	}

	switch (type) {
		case 7:
			return 7;
		case 6:
			// Type 6 is 4, 1 so you can convert into 5
			return 7;
		case 5:
			// Type 5 is 3, 2 so you either have 3 wildcards or 2, but you can convert into 5 no matter what
			return 7;
		case 4:
			// 3, 1, 1, either 3 wildcards or 1, but in both case you can do 4 of a kind
			return 6;
		case 3:
			// 2, 2, 1, either 2 wildcards or 1. So either 4 of a kind or 3, 2
			return nbWildcard === 2 ? 6 : 5;
		case 2:
			// 2, 1, 1, 1 either 2 wildcards or 1. Both leads to 3, 1, 1
			return 4;
		case 1:
			// every card is different, best you can do is 2, 1, 1, 1
			return 2;
	}
}
