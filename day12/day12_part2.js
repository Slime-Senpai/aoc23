const fs = require('fs');

const inputText = fs.readFileSync('./day12_input.txt', { encoding: 'utf-8' });
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
	/**
	 * @type [{groups: number, nbBroken: number, permutations: number}]
	 */
	let cache = [{ groups: 0, nbBroken: 0, permutations: 1 }];

	for (const spring of line.splitSprings) {
		switch (spring) {
			case '#':
				// We add another brokenspring in the current group
				cache.forEach((e) => e.nbBroken++);
				break;
			case '.':
				const toRemove = [];
				cache.forEach((e) => {
					// If we are currently tracking a group, we need to count it more
					if (e.nbBroken > 0) {
						// If it doesn't match the number of springs for that group, that's bad
						if (line.springGroups[e.groups] !== e.nbBroken) {
							toRemove.push(e);
						} else {
							e.groups++;
							e.nbBroken = 0;
						}
					}
				});

				for (const remove of toRemove) {
					cache.splice(cache.indexOf(remove), 1);
				}
				break;
			case '?':
				const toAdd = [];
				cache.forEach((e) => {
					// If we are in a group, we can know what is the state of the spring
					if (e.nbBroken > 0) {
						if (line.springGroups[e.groups] === e.nbBroken) {
							// If we have reached the number of broken for that group, we take it as a '.'
							e.groups++;
							e.nbBroken = 0;
						} else {
							// Otherwise, we take it as a '#'
							e.nbBroken++;
						}
						return;
					}
					// If we're not in a group, either we can start a new group, or continue without a group
					// We copy the current in a new possible way
					toAdd.push({ ...e });
					// We create a new group in the current
					e.nbBroken++;
				});
				cache.push(...toAdd);
				break;
		}

		cache = cache.filter((e) => {
			// We can filter out the ones that have too many groups
			if (e.groups > line.springGroups.length) {
				return false;
			}

			// We can filter the ones that have too many broken for that group
			if (e.nbBroken > line.springGroups[e.groups]) {
				return false;
			}

			return true;
		});

		// We can clear the duplicates and count them as permutations, this happens for example when we have ..#. and .#.. We have two permutations with one group
		// We don't need to keep calculating those differently as they'll act the same afterwards. We can just note that they are two of them and calculate the rest once
		const newCache = [];
		const toIgnore = [];
		for (let i = 0; i < cache.length; i++) {
			const group = cache[i];
			if (toIgnore.find((e) => e.groups === group.groups && e.nbBroken === group.nbBroken) !== undefined) {
				continue;
			}
			for (let j = 0; j < cache.length; j++) {
				if (i === j) {
					continue;
				}

				const group2 = cache[j];
				if (group.groups === group2.groups && group.nbBroken === group2.nbBroken) {
					// If we find another similar group, we merge them
					group.permutations += group2.permutations;
					// We'll ignore the other group
					toIgnore.push(group2);
					break;
				}
			}
			// We save that group
			newCache.push(group);
		}

		cache = newCache;
	}

	const toRemove = [];
	cache.forEach((e) => {
		// If we are currently tracking a group, we need to count it more
		if (e.nbBroken > 0) {
			// If it doesn't match the number of springs for that group, that's bad
			if (line.springGroups[e.groups] !== e.nbBroken) {
				toRemove.push(e);
				return;
			}

			e.groups++;
			e.nbBroken = 0;
		}

		// If the number of groups is bad, we remove it
		if (e.groups !== line.springGroups.length) {
			toRemove.push(e);
		}
	});

	for (const remove of toRemove) {
		cache.splice(cache.indexOf(remove), 1);
	}

	for (const permutation of cache) {
		total += permutation.permutations;
	}
}
console.log('total', total);
