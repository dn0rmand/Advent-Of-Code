const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

function loadData()
{
    const readFile = require("advent_tools/readfile");

    let time;
    let buses;

    for(const line of readFile(__filename))
    {
        const values = line.split(',');
        if (values.length === 1)
            time = +line;
        else
            buses = values.map(v => v === 'x' ? 0 : +v);
    }

    return { time, buses };
}

function part1(time, buses)
{
    let bestBus = 0;
    let offset  = Number.MAX_SAFE_INTEGER;

    buses.forEach(bus => {
        if (bus !== 0) {
            const x = Math.ceil(time / bus);

            const o = (x * bus)- time;
            if (o < offset) {
                offset = o;
                bestBus= bus;
            }
        }
    });

    return offset * bestBus;
}

function part2(buses)
{
    const gcd = (a, b) =>
    {
        while (b !== 0) {
            [a, b] = [b , a % b];
        }
        return a;
    }

    const lcm = (a, b) => (a / gcd(a, b)) * b;

    let answer = 0;
    let offset = 1;

    buses.forEach((id, index) => {
        if (id === 0)
            return;

        const target = (id - (index % id)) % id;

        while (answer % id !== target) {
            answer += offset;
        }
        offset = lcm(offset, id);
    });

    return answer;
}

console.log(`--- Advent of Code day ${DAY} ---`);

const { time, buses } = loadData();

console.time('part-1');
console.log(`Part 1: ${part1(time, buses)}`);
console.timeLog('part-1', `to execute part 1 of day ${DAY}`);

console.time('part-2');
console.log(`Part 2: ${part2(buses)}`);
console.timeLog('part-2', `to execute part 2 of day ${DAY}`);
