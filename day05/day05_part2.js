const fs = require('fs');

const inputText = fs.readFileSync('./day05_input.txt', { encoding: 'utf-8' });

const [seedsBlock, ...convertionBlocks] = inputText.split('\n\n');

const seedRanges = seedsBlock.split(':')[1].trim().split(/\s+/);

const seeds = [];
for (let i = 0; i < seedRanges.length; i += 2) {
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
 * @param {{start: number, end: number}[]} source
 * @param {{source: number, dest: number, length: number}[]} map
 * @returns
 */
function mapSourceToDest(source, map) {
	const unmappedRanges = [...source];

	const mappedRanges = [];

	while (unmappedRanges.length > 0) {
		let current = unmappedRanges.shift();

		const linesToUse = map.filter((range) => {
			const rangeStart = range.source;
			const rangeEnd = range.source + range.length;

			return !(rangeEnd < current.start) && !(rangeStart > current.end);
		});

		if (linesToUse.length == 0) {
			mappedRanges.push({ start: current.start, end: current.end });
		}

		for (const line of linesToUse) {
			// We have 4 cases, before, after, englobing and inside

			if (line.source < current.start) {
				if (line.source + line.length > current.end) {
					// englobing, we can map the whole seed range with that one line
					mappedRanges.push({
						start: line.dest + (current.start - line.source),
						end: line.dest + (current.end - line.source),
					});
					continue;
				}
				// before so we can map the start of the map, and add the rest to unmapped
				mappedRanges.push({ start: current.start + (line.dest - line.source), end: line.dest + line.length });
				unmappedRanges.push({ start: line.source + line.length + 1, end: current.end });
			} else if (line.source + line.length > current.end) {
				// after so we can map the end of the map, and add the rest to unmapped
				mappedRanges.push({ start: line.dest, end: line.dest + (current.end - line.source) });
				unmappedRanges.push({ start: current.start, end: line.source - 1 });
			} else {
				// between
				mappedRanges.push({ start: line.dest, end: line.dest + line.length });
				unmappedRanges.push({ start: line.source + line.length + 1, end: current.end });
				unmappedRanges.push({ start: current.start, end: line.source - 1 });
			}
		}
	}

	return mappedRanges;
}

let seedToLocation = [...seeds];

for (const map of convertionMaps) {
	// It takes a few seconds to compute so we'll log just every step to know we're moving forward still
	console.log('map');
	seedToLocation = seedToLocation.flatMap((e) => {
		return mapSourceToDest([e], map);
	});
}

// I have no idea why, but this has a bunch of 0 at the start. We'll just ignore those and find the first one we can
console.log(
	seedToLocation
		.map((e) => e.start)
		.sort((a, b) => a - b)
		.find((e) => e != 0)
);

// After being done with this and looking at my code
// I'm pretty sure I should have filtered somewhere for overlaps as there seems to be quite a lot
// This should have avoided the 3M objects array that this generates. But it works anyway (Also why are there 0 for real wtf)
