const fs = require('fs');

const inputText = fs.readFileSync('./day13_input.txt', { encoding: 'utf-8' });

const patterns = inputText.split('\n\n').map((e) =>
	e.split('\n').map((f) => {
		return { arr: f.split(''), str: f };
	})
);

let sum = 0;
for (const pattern of patterns) {
	let found = false;
	for (let i = 1; i < pattern.length; i++) {
		let symmetrical = true;
		let smudgeUsed = false;
		for (let dist = 1; dist <= Math.min(i, pattern.length - i); dist++) {
			const before = pattern[i - dist].str;

			const after = pattern[i + dist - 1].str;

			if (before !== after) {
				if (!smudgeUsed) {
					// We can try and see if only one character is diff
					let nbDiff = 0;
					for (let charI = 0; charI < after.length; charI++) {
						if (before[charI] !== after[charI]) {
							nbDiff++;
						}

						if (nbDiff > 1) {
							break;
						}
					}

					if (nbDiff < 2) {
						smudgeUsed = true;
						continue;
					}
				}
				symmetrical = false;
				break;
			}
		}

		if (symmetrical && smudgeUsed) {
			found = true;
			sum += 100 * i;
			break;
		}
	}
	if (found) {
		continue;
	}
	for (let j = 1; j < pattern[0].str.length; j++) {
		let symmetrical = true;
		let smudgeUsed = false;
		for (let dist = 1; dist <= Math.min(j, pattern[0].str.length - j); dist++) {
			const before = pattern.map((e) => e.arr[j - dist]).join('');

			const after = pattern.map((e) => e.arr[j + dist - 1]).join('');

			if (before !== after) {
				if (!smudgeUsed) {
					// We can try and see if only one character is diff
					let nbDiff = 0;
					for (let charI = 0; charI < after.length; charI++) {
						if (before[charI] !== after[charI]) {
							nbDiff++;
						}

						if (nbDiff > 1) {
							break;
						}
					}

					if (nbDiff < 2) {
						smudgeUsed = true;
						continue;
					}
				}
				symmetrical = false;
				break;
			}
		}
		if (symmetrical && smudgeUsed) {
			sum += j;
			break;
		}
	}
}

console.log(sum);
