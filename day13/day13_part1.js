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
		for (let dist = 1; dist <= Math.min(i, pattern.length - i); dist++) {
			const before = pattern[i - dist].str;

			const after = pattern[i + dist - 1].str;

			if (before !== after) {
				symmetrical = false;
				break;
			}
		}

		if (symmetrical) {
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
		for (let dist = 1; dist <= Math.min(j, pattern[0].str.length - j); dist++) {
			const before = pattern.map((e) => e.arr[j - dist]).join('');

			const after = pattern.map((e) => e.arr[j + dist - 1]).join('');

			if (before !== after) {
				symmetrical = false;
				break;
			}
		}
		if (symmetrical) {
			sum += j;
			break;
		}
	}
}

console.log(sum);
