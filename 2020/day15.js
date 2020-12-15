const assert = require('assert');

function search(input, target)
{
    const indexes = new Int32Array(target + 1).fill(-1);

    let count = 0;
    let last  = 0;
    for(const i of input) 
    { 
        indexes[i] = count++;
        last = i;
    }

    let next = 0;
    while (count < target) {
        last = next;
        const index = indexes[next];
        indexes[next] = count++; 

        if (index === -1) {
            next = 0;
        } else {
            next = count-index-1;
        }
    }

    return last;
}

function part1(input)
{
    return search(input, 2020);
}

function part2(input)
{
    return search(input, 30000000);
}

console.log('--- Advent of Code day 14 ---');

assert.strictEqual(part1([0, 3, 6]), 436);
assert.strictEqual(part1([1, 3, 2]), 1);
assert.strictEqual(part1([2, 1, 3]), 10);
assert.strictEqual(part1([1, 2, 3]), 27);
assert.strictEqual(part1([2, 3, 1]), 78);
assert.strictEqual(part1([3, 2, 1]), 438);
assert.strictEqual(part1([3, 1, 2]), 1836);

const input = [20, 9, 11, 0, 1, 2];

console.time('part-1');
console.log(`Part 1: ${part1(input)}`);
console.timeLog('part-1', 'to execute part 1 of day 14');

console.time('part-2');
console.log(`Part 2: ${part2(input)}`);
console.timeLog('part-2', 'to execute part 2 of day 14');

