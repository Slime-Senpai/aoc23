const fs = require('fs');

const inputText = fs.readFileSync('./day05_input.txt', { encoding: 'utf-8' });

const [seedsBlock, ...convertionBlocks] = inputText.split('\n\n');

const seeds = seedsBlock.split(':')[1].trim().split(/\s+/);

const convertionMaps = convertionBlocks.map((e) => {
	const numberRanges = e.split(':')[1].trim().split('\n');
	return numberRanges.map((text) => {
		const [dest, source, length] = text.split(/\s+/);

		return { source: +source, dest: +dest, length: +length };
	});
});

function mapSourceToDest(source, map) {
	let lineToUse = map.find((e) => e.source <= source && e.source + e.length >= source);

	if (lineToUse == undefined) {
		lineToUse = { source: source, dest: source, length: 1 };
	}

	return lineToUse.dest + (source - lineToUse.source);
}

let seedToLocation = [...seeds];
for (const map of convertionMaps) {
	seedToLocation = seedToLocation.map((e) => mapSourceToDest(+e, map));
}

console.log(Math.min(...seedToLocation));
