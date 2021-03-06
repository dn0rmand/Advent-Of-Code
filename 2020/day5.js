module.exports = function()
{
    const assert = require('assert');

    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    function loadTestData()
    {
        return [
            'FBFBBFFRLR',
            'BFFFBBFRRR',
            'FFFBBBFRRR',
            'BBFFBBFRLL',
        ];
    }

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const entries = [];

        for(const line of readFile(__filename))
        {
            entries.push(line);
        }

        return entries;
    }

    function decode(data)
    {
        let minRow = 0, maxRow = 127;
        let minCol = 0, maxCol = 7;

        for(const d of data)
        {
            switch(d)
            {
                case 'F':
                    maxRow = Math.floor((maxRow+minRow) / 2);
                    break;
                case 'B':
                    minRow = Math.ceil((maxRow+minRow) / 2);
                    break;
                case 'L':
                    maxCol = Math.floor((maxCol+minCol) / 2);
                    break;
                case 'R':
                    minCol = Math.ceil((maxCol+minCol) / 2);
                    break;
            }
        }

        assert.strictEqual(minRow, maxRow);
        assert.strictEqual(minCol, maxCol);

        return (minRow * 8) + minCol;
    }

    function part1(input)
    {
        return input.reduce((a, v) => Math.max(a, decode(v)), 0);
    }

    function part2(input)
    {
        const MAX = 128*8;

        const map   = input.reduce((a, v) => {
            a[decode(v)] = 1;
            return a;
        }, new Uint8Array(MAX));

        for(let id = 1; id < MAX-1; id++) {
            if (!map[id] && map[id-1] && map[id+1]) {
                return id;
            }
        }

        throw "Seat not found";
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();

    console.time(`${DAY}-both`);

    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);

    console.timeLog(`${DAY}-both`, `to execute both parts of day ${DAY}`);
};
