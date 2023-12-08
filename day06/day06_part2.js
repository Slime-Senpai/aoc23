const fs = require('fs');

const inputText = fs.readFileSync('./day06_input.txt', { encoding: 'utf-8' });

const [time, distance] = inputText.split('\n').map((e) => +e.split(':')[1].trim().split(/\s+/).join(''));

console.log(time, distance);

function getDistanceForWaitTime(waitTime, totalTime) {
	return (totalTime - waitTime) * waitTime;
}

let nbRecord = 0;
for (let waitTime = 0; waitTime < time; waitTime++) {
	let distanceForWait = getDistanceForWaitTime(waitTime, time);
	if (distanceForWait > distance) {
		nbRecord++;
	}
}

console.log(nbRecord);
