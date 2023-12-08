const fs = require('fs');

const inputText = fs.readFileSync('./day06_input.txt', { encoding: 'utf-8' });

const [times, distances] = inputText.split('\n').map((e) => e.split(':')[1].trim().split(/\s+/));

function getDistanceForWaitTime(waitTime, totalTime) {
	return (totalTime - waitTime) * waitTime;
}

let sum = 1;
for (let i = 0; i < times.length; i++) {
	let nbRecord = 0;
	for (let waitTime = 0; waitTime < times[i]; waitTime++) {
		let distanceForWait = getDistanceForWaitTime(waitTime, times[i]);
		if (distanceForWait > distances[i]) {
			nbRecord++;
		}
	}
	sum *= nbRecord;
}

console.log(sum);
