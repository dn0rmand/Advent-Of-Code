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

function part1()
{
    const input = loadData();

    let j3 = 1;
    let j1 = 0;
    let j  = 0;

    for(const a of input) {
        switch (a-j) {
            case 0:
                throw "ERROR";
            case 1:
                j1++;
                break;
            case 2:
                break;
            case 3:
                j3++;
                break;
            default:
                throw "ERROR";
        }
        j = a;
    }

    return j1*j3;
}

function part2()
{
    const makeKey = state => `${state.jolt}-${state.input.join(':')}`;

    let states = new Map();
    let mainInput = loadData().reverse();

    states.set('start', { jolt:mainInput[0]+3, input: mainInput, count: 1 });

    let total = 0;

    while(states.size > 0) {
        const newStates = new Map();

        for(const state of states.values()) 
        {
            if (state.jolt <= 3) 
            {
                // reached a starting point
                total += state.count;
            }

            for(let i = 0; i < state.input.length; i++) 
            {
                const a = state.input[i];
                if ((state.jolt - a) > 3)
                    break;

                const newState = {
                    jolt: a,
                    input: state.input.slice(i+1),
                    count: state.count,
                };

                const key = makeKey(newState);
                const old = newStates.get(key);
                if (old) 
                {
                    old.count += newState.count;
                } 
                else 
                {
                    newStates.set(key, newState);
                }
            }
        }

        states = newStates;
    }

    return total;
}

console.log('--- Advent of Code day 10 ---');

console.time('Day10');

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

console.timeLog('Day10', 'to execute both parts of day 10');
