const fs = require('fs');

const inputText = fs.readFileSync('./day12_input.txt', { encoding: 'utf-8' });

const splitRegex = /(?:\?|\.)*(#+)(?:\?|\.)*/g;

/**
 * @type Map<string, string[]> The cache for the permutations
 */
const cache = new Map();

const lines = inputText
	.split('\n')
	.map((e) => e.split(' '))
	.map((e) => {
		const splitSprings = e[0].split('');
		let nbBroken = 0;
		let nbWorking = 0;
		let nbUnknown = 0;

		for (const s of splitSprings) {
			switch (s) {
				case '.':
					nbWorking++;
					break;
				case '#':
					nbBroken++;
					break;
				default:
					nbUnknown++;
			}
		}

		const springGroups = e[1].split(',').map((f) => +f);

		return {
			nbBroken,
			nbWorking,
			nbUnknown,
			knownBroken: springGroups.reduce((a, b) => a + b, 0),
			total: splitSprings.length,
			springGroups,
			splitSprings,
			string: e[0]
		};
	});

let total = 0;
for (const line of lines) {
	const nbBrokenMissing = line.knownBroken - line.nbBroken;
	const nbWorkingMissing = line.nbUnknown - nbBrokenMissing;
	const possiblePermutations = getPermutationsFor(nbWorkingMissing, nbBrokenMissing);
	let nbGoodPermutations = 0;
	for (const permutation of possiblePermutations) {
		let filled = 0;
		let filledArray = [...line.splitSprings];
		for (let i = 0; i < filledArray.length; i++) {
			if (filledArray[i] === '?') {
				filledArray[i] = permutation[filled++];
			}
		}

		const groups = getGroups(filledArray.join(''));
		let isGoodPermutation = groups.every((e, i) => e.length === line.springGroups[i]);

		if (isGoodPermutation) {
			nbGoodPermutations++;
		}
	}
	console.log(nbGoodPermutations);
	total += nbGoodPermutations;
}

console.log('total', total);

// Utility functions

/**
 * @param {number} nbWorking
 * @param {number} nbBroken
 */
function getPermutationsFor(nbWorking, nbBroken) {
	const result = [];
	const cached = cache.get(`${nbWorking}-${nbBroken}`);
	if (cached) {
		return cached;
	}
	generatePermutations(nbWorking, nbBroken, '', result);
	cache.set(`${nbWorking}-${nbBroken}`, result);
	return result;
}

/**
 * @param {number} nbWorking
 * @param {number} nbBroken
 * @param {string} currString
 * @param {string[]} result
 */
function generatePermutations(nbWorking, nbBroken, currString, result) {
	if (nbWorking === 0 && nbBroken === 0) {
		result.push(currString);
		return;
	}

	if (nbWorking > 0) {
		generatePermutations(nbWorking - 1, nbBroken, currString + '.', result);
	}

	if (nbBroken > 0) {
		generatePermutations(nbWorking, nbBroken - 1, currString + '#', result);
	}
}

/**
 * @param {string} string
 */
function getGroups(string) {
	const matches = string.matchAll(splitRegex);

	let i = 0;
	let match = matches.next();
	let groups = [];
	while (!match.done) {
		groups.push(match.value[1]);
		match = matches.next();
		i++;
	}
	return groups;
}
