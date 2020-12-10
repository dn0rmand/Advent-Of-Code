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

function part1()
{
    const input = loadData();
    return 0;
}

function part2()
{
    const input = loadData();
    return 0;
}

console.log('--- Advent of Code day 10 ---');

console.time('Day10');

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

console.timeLog('Day10', 'to execute both parts of day 10');
