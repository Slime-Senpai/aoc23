const fs = require('fs');

const inputText = fs.readFileSync('./day05_example.txt', { encoding: 'utf-8' });

const [seedsBlock, ...convertionBlocks] = inputText.split('\n\n');

const seedRanges = seedsBlock.split(':')[1].trim().split(/\s+/);

const seeds = [];
for (let i = 0; i < seeds.length; i += 2) {
	seeds.push({
		start: +seedRanges[i],
		end: +seedRanges[i] + +seedRanges[i + 1],
	});
}

const convertionMaps = convertionBlocks.map((e) => {
	const numberRanges = e.split(':')[1].trim().split('\n');
	return numberRanges.map((text) => {
		const [dest, source, length] = text.split(/\s+/);

		return { source: +source, dest: +dest, length: +length };
	});
});

/**
 *
 * @param {{start: number, end: number}} source
 * @param {{source: number, dest: number, length: number}[]} map
 * @returns
 */
function mapSourceToDest(source, map) {
	const unmappedRanges = [source];

	const mappedRanges = [];

	while (unmappedRanges.length > 0) {
		let current = unmappedRanges.shift();

		const linesToUse = map.filter((range) => {
			const rangeStart = range.source;
			const rangeEnd = range.source + range.length;
	
			return rangeStart <= current.end && rangeEnd >= current.start;
		});
	
		for (const line of linesToUse) {
			// We have 4 cases, before, after, englobing and inside
	
			if (line.source < current.start) {
				if (line.source + line.length > current.end) {
					// englobing, we can map the whole seed range with that one line
					mappedRanges.push({ start: line.dest + (current.start - line.source), end: line.dest + (current.end - line.source) });
				}
				// before so we can map the start of the map, and add the rest to unmapped
			} else if (line.source + line.length > current.end) {
				// after
			} else {
				// between
			}
		}
	}


	if (lineToUse == undefined) {
		lineToUse = { source: source, dest: source, length: 1 };
	}

	return lineToUse.dest + (source - lineToUse.source);
}

let seedToLocation = [...seeds];
for (const map of convertionMaps) {
	seedToLocation = seedToLocation.flatMap((e) => mapSourceToDest(e, map));
}

console.log(Math.min(...seedToLocation));
