const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

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

console.log(`--- Advent of Code day ${DAY} ---`);

console.time(`${DAY}-part-1`);
console.log(`Part 1: ${part1()}`);
console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

console.time(`${DAY}-part-2`);
console.log(`Part 2: ${part2()}`);
console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
