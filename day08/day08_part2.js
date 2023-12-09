const fs = require('fs');

const inputText = fs.readFileSync('./day08_input.txt', { encoding: 'utf-8' });

const [instructions, lines] = inputText.split('\n\n');

/**
 * @type Map<string, {
		name: string,
		left: string,
		right: string,
		ll: string,
		stepToReachFromStart: Map<string, number>,
		loopingValueFromStart: Map<string, number>
	}>
 */
const paths = new Map();

const pathRegex = /(.*) = \((.*), (.*)\)/;

for (let line of lines.split('\n')) {
	const [, name, left, right] = line.match(pathRegex);

	const path = {
		name: name,
		left: left,
		right: right,
		// Last Letter
		ll: name.charAt(2),
		stepToReachFromStart: new Map(),
		loopingValueFromStart: new Map()
	};

	paths.set(name, path);
}

let startingPaths = [];
let endingPaths = [];

// We get all the starting paths
for (const [name, path] of paths) {
	if (path.ll === 'A') {
		startingPaths.push(name);
	} else if (path.ll === 'Z') {
		endingPaths.push(name);
	}
}

let startToEnd = new Map();

// We start by creating a map between start/end and the number of steps it takes
for (const startingPath of startingPaths) {
	for (const endingPath of endingPaths) {
		startToEnd.set(startingPath + endingPath, 0);
	}
}

// Because brute forcing would take too long, we're going to use the stinky maths to solve this
// First we'll calculate the number of steps to reach all the end goals from all the start goals
let currentPaths = [...startingPaths];
let steps = 0;
let instructionIndex = 0;

const startpointsLeftToCheck = [...startingPaths];

while (startpointsLeftToCheck.length > 0) {
	const newPaths = [];
	const direction = instructions.charAt(instructionIndex);
	for (let currentPath of currentPaths) {
		const possiblePaths = paths.get(currentPath);

		newPaths.push(direction === 'L' ? possiblePaths.left : possiblePaths.right);
	}
	instructionIndex = (instructionIndex + 1) % instructions.length;
	currentPaths = newPaths;
	steps++;
	for (let i = 0; i < currentPaths.length; i++) {
		const path = paths.get(currentPaths[i]);

		const index = startingPaths[i] + instructionIndex;

		if (path.stepToReachFromStart.get(index)) {
			if (startpointsLeftToCheck.includes(startingPaths[i])) {
				if (path.loopingValueFromStart.get(index)) {
					startpointsLeftToCheck.splice(startpointsLeftToCheck.indexOf(startingPaths[i]), 1);
				} else {
					path.loopingValueFromStart.set(index, steps - path.stepToReachFromStart.get(index));
				}
			}
		} else {
			path.stepToReachFromStart.set(index, steps);
		}
	}
}

// After noticing how the input works, the stepToReach and loopingValues are the same and there's only one Z per A node
// We can now just find the LCM of all the numbers
const numbersToCalculate = [...paths.values()].filter((e) => e.ll === 'Z').map((e) => e.loopingValueFromStart.values().next().value);

// https://www.geeksforgeeks.org/javascript-program-to-find-lcm-of-two-numbers/#:~:text=JavaScript%20Program%20to%20Find%20LCM%20of%20Two%20Numbers%20using%20Formula,formula%20to%20determine%20the%20LCM.
function findLCM(a, b) {
	let lar = Math.max(a, b);
	let small = Math.min(a, b);
	for (i = lar; ; i += lar) {
		if (i % small == 0) return i;
	}
}

const lcm = numbersToCalculate.reduce((a, b) => findLCM(a, b));

// That is the answer
console.log(lcm);
