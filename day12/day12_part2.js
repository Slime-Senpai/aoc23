const fs = require('fs');

const inputText = fs.readFileSync('./day12_input1.txt', { encoding: 'utf-8' });
// 16990 for input1
const lines = inputText
	.split('\n')
	.map((e) => e.split(' '))
	.map((e) => {
		let expandedString = e[0];
		let expandedGroups = e[1];
		for (let i = 0; i < 4; i++) {
			expandedString += '?' + e[0];
			expandedGroups += ',' + e[1];
		}

		return [expandedString, expandedGroups];
	})
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
	//console.log(line);
	const nbPermutationsForLine = getNbGoodPermutations(0, line.string.charAt(0), line, [], 0, '');

	console.log(nbPermutationsForLine);
	total += nbPermutationsForLine;
}
console.log('total', total);

/**
 * @param {number} index
 * @param {string} currChar
 * @param {{nbBroken: number,nbWorking: number,nbUnknown: number,knownBroken: number,total: number,springGroups: number[],splitSprings: string[],string: string}} line
 * @param {number[]} groups
 * @param {number} nbBroken
 */
function getNbGoodPermutations(index, currChar, line, groups, nbBroken, str) {
	switch (currChar) {
		case '#':
			nbBroken++;
			break;
		case '.':
			if (index > 0 && str.charAt(index - 1) === '#') {
				groups.push(nbBroken);
				nbBroken = 0;
			}
			break;
		case '?':
			const nbForBroken = getNbGoodPermutations(index, '#', line, [...groups], nbBroken, str);
			const nbForWorking = getNbGoodPermutations(index, '.', line, [...groups], nbBroken, str);
			return nbForBroken + nbForWorking;
	}

	// If a group is different, it means there is no good permutations for that group
	if (groups.some((e, i) => e !== line.springGroups[i]) || nbBroken > line.springGroups[groups.length]) {
		return 0;
	}

	if (index === line.string.length - 1) {
		if (nbBroken > 0) {
			groups.push(nbBroken);
		}
		// If we have all the groups filled with the good amount (checked above, we can return 1, otherwise 0)
		if (groups.every((e, i) => e === line.springGroups[i]) && groups.length === line.springGroups.length) {
			return 1;
		} else {
			return 0;
		}
	}

	return getNbGoodPermutations(index + 1, line.string.charAt(index + 1), line, [...groups], nbBroken, str + currChar);
}
