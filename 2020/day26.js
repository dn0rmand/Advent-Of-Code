// https://csokavar.hu/projects/casette/

module.exports = function() {
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const entries = [];

        for(const line of readFile(__filename))
        {
            entries.push(line.split(',').map(v => +v));
        }

        return entries;
    }

    function part1()
    {
        const input = loadData();

        const digits = [];

        for(const row of input)
        {
            let previous = row[0];
            let minReached = 0;
            let maxReached = 0;
            let direction = 0;

            for(const value of row)
            {
                if (value > previous) {
                    if (direction === 0) {
                        direction = 1;
                    } else if (direction === -1) {
                        minReached++;
                        direction = 1;
                    }
                } else if (value < previous) {
                    if (direction === 0) {
                        direction = -1;
                    } else if (direction === 1) {
                        maxReached++;
                        direction = -1;
                    }
                }

                previous = value;
            }
            const freq = (Math.max(minReached, maxReached) | 1) - 1;

            switch (freq)
            {
                case 4: 
                    digits.push(0);
                    break;
                case 8:
                    digits.push(1);
                    break;
                case 12:
                    digits.push(2);
                    break;
                default:
                    throw "INVALID FREQUENCY";
            }
        }

        return digits;
    }

    function part2(digits)
    {
        const values = [];

        for(let i = 0; i < digits.length; i += 8)
        {
            if  (digits[i] !== 0)
                throw "ERROR: Invalid leading digit";
            if (digits[i+6] !== 1 && digits[i+7] !== 2) 
                throw "ERROR: Invalid trailing marker";

            let value = 0;
            for(let j = 1; j < 6; j++)
                value = value * 3 + digits[i+j];

            values.push(String.fromCharCode(value));
        }

        return values.join('');
    }

    console.log(`--- Advent of Code day ${DAY} ---`);
    console.log('');
    console.time(`${DAY}-both`);
    const digits = part1();
    console.log(part2(digits));
    console.timeLog(`${DAY}-both`, `to execute part 2 of day ${DAY}`);
};
