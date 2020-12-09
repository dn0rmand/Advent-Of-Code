function loadData()
{
    const readFile = require("advent_tools/readfile");

    const entries = [];

    for(const line of readFile(__filename))
    {
        entries.push(+line);
    }

    return entries;
}

function part1(input)
{
    const preamble = input.slice(0, 25);
    let answer = -1;

    for(let i = preamble.length; i < input.length; i++) {
        const value = input[i];
        let found = false;

        for(const c of preamble) {
            const v = value-c;
            if (v !== c && v >= 0 && preamble.includes(v)) {
                found = true;
                break;
            }
        }

        if (! found)
        {
            answer = value;
            break;
        }

        preamble.shift();
        preamble.push(value);
    }

    return answer;
}

function part2(input, target)
{    
    target = target || part1();

    let sum = 0;
    let start = 0;
    let end = 0;

    for(let i = 0; !end && i < input.length; i++) 
    {
        const value = input[i];
        sum += value;
        if (sum === target && i > start+1) 
        {
            end = i+1;
        }
        else 
        {
            while (sum > target) 
            {
                sum -= input[start++];
                if (sum === target && i > start+1) 
                {
                    end = i+1;
                    break;
                }
            }
        }
    }

    if (sum === target)
    {
        const values = input.slice(start, end).sort((a, b) => a-b);
        return values[0] + values[values.length-1]
    }

    throw "NO SOLUTION";
}

console.log('--- Advent of Code day 9 ---');


console.time('Day9');

const input = loadData();
const part1Answer = part1(input);
const part2Answer = part2(input, part1Answer);

console.log(`Part 1: ${part1Answer}`);
console.log(`Part 2: ${part2Answer}`);

console.timeLog('Day9', 'to execute both parts of day 9');
