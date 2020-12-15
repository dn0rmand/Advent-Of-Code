const assert = require('assert');

const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

function loadTestData()
{
    return [
        '..##.......',
        '#...#...#..',
        '.#....#..#.',
        '..#.#...#.#',
        '.#...##..#.',
        '..#.##.....',
        '.#.#.#....#',
        '.#........#',
        '#.##...#...',
        '#...##....#',
        '.#..#...#.#',
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

function calculateTrees(input, {  right, down })
{
    let x = 0, y = 0;
    const width = input[0].length;

    assert.strictEqual(input[y][x], '.');

    let trees = 0;
    while (y < input.length) {
        x = (x + right) % width;
        y = y + down;

        if (y < input.length && input[y][x] === '#') {
            trees++;
        }
    }

    return trees;
}

function part1()
{
    const slope = {right: 3, down: 1};

    const testInput = loadTestData();
    assert.strictEqual(calculateTrees(testInput, slope), 7);

    const input = loadData();
    const trees = calculateTrees(input, slope);

    return trees;
}

function part2()
{
    const slopes = [
        {right: 1, down: 1},
        {right: 3, down: 1},
        {right: 5, down: 1},
        {right: 7, down: 1},
        {right: 1, down: 2},
    ];

    const testInput = loadTestData();

    const testTrees = slopes.reduce((a, slope) => a * calculateTrees(testInput, slope), 1);
    assert.strictEqual(testTrees, 336);

    const input = loadData();
    const trees = slopes.reduce((a, slope) => a * calculateTrees(input, slope), 1);

    return trees;
}

console.log(`--- Advent of Code day ${DAY} ---`);

console.time('both');

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

console.timeLog('both', `to execute both parts of day ${DAY}`);
