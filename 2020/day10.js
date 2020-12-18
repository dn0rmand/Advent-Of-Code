module.exports = function()
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const entries = [];

        for(const line of readFile(__filename))
        {
            entries.push(+line);
        }

        entries.sort((a, b) => a-b);

        return entries;
    }

    function part1(input)
    {
        let j3 = 1;
        let j1 = 0;
        let j  = 0;

        for(const a of input) {
            const o = a-j;
            if (o === 1)
                j1++;
            else if (o === 3)
                j3++;
            j = a;
        }

        return j1*j3;
    }

    function part2(input)
    {
        const target  = input[input.length-1]+3;

        let states = [{ jolt: 0, index: 0, count: 1 }];

        let total = 0;

        while(states.length > 0)
        {
            const newStates = [];

            for(const idx in states)
            {
                const state = states[idx];

                if (state.jolt+3 === target)
                {
                    total += state.count;
                }

                for(let i = 0; i < 4; i++)
                {
                    const a = input[i + state.index];

                    if (!a || (a - state.jolt) > 3)
                        break;

                    const old = newStates[a];
                    if (old)
                    {
                        old.count += state.count;
                    }
                    else
                    {
                        newStates[a] = {
                            jolt: a,
                            index: state.index + i + 1,
                            count: state.count,
                        };
                    }
                }
            }

            states = newStates;
        }

        return total;
    }

    function part2B(input)
    {
        const target = input[input.length-1] + 3;
        const counts = new Array(target+1);

        counts.fill(0);
        counts[0] = 1;

        input.push(target);

        for(let i = 0; i < input.length; i++) {
            const value = input[i];
            for(let a = 1; a <= 3; a++) {
                const idx = value-a;
                if (idx >= 0)
                    counts[value] += counts[idx];
            }
        }

        const answer = counts[target];

        return answer;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(input)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);

    console.time(`${DAY}-part-2b`);
    console.log(`Part 2: ${part2B(input)}`);
    console.timeLog(`${DAY}-part-2b`, `to execute part 2 (B) of day ${DAY}`);
};