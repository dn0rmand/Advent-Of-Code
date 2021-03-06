module.exports = function()
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    const TURNS = 6;
    const MAX_SIZE = 16 * (TURNS+1)

    class Cube
    {
        constructor(x, y, z, w, count)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            this.neighbourCount = count || 0;
            this.key = (((x*MAX_SIZE)+y)*MAX_SIZE + z)*MAX_SIZE + w;
        }

        forEachNeighbours(part2, callback)
        {
            const ox = [this.x-1, this.x, this.x+1];
            const oy = [this.y-1, this.y, this.y+1];
            const oz = [this.z-1, this.z, this.z+1];
            const ow = part2 ? [this.w-1, this.w, this.w+1] : [this.w];

            for(const x of ox)
            {
                for(const y of oy)
                {
                    for(const z of oz)
                    {
                        for(const w of ow)
                        {
                            if (x !== this.x || y !== this.y || z !== this.z || w !== this.w)
                            {
                                callback(new Cube(x, y, z, w, 1));
                            }
                        }
                    }
                }
            }
        }
    }

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const cubes = new Map();

        let y = 0;
        for(const line of readFile(__filename))
        {
            for (let x = 0; x < line.length; x++)
            {
                if (line[x] === '#')
                {
                    const cube = new Cube(x, y, 0, 0);
                    cubes.set(cube.key, cube);
                }
            }
            y++;
        }

        return cubes;
    }

    function turn(cubes, part2)
    {
        const neighbours = new Map();

        cubes.forEach(cube =>
        {
            cube.forEachNeighbours(part2, neighbour =>
            {
                const old = neighbours.get(neighbour.key);
                if (old)
                    old.neighbourCount += neighbour.neighbourCount;
                else
                    neighbours.set(neighbour.key, neighbour);
            });
        });

        const output = new Map();

        neighbours.forEach(cube =>
        {
            if (cube.neighbourCount === 2 && cubes.has(cube.key))
            {
                // already active so stay active
                output.set(cube.key, cube);
            }
            else if (cube.neighbourCount === 3)
            {
                // either stay active or become active
                output.set(cube.key, cube);
            }
        });

        return output;
    }

    function part1(input)
    {
        let cubes = input;

        for(let cycle = 0; cycle < TURNS; cycle++)
        {
            cubes = turn(cubes);
        }

        return cubes.size;
    }

    function part2(input)
    {
        let cubes = input;

        for(let cycle = 0; cycle < TURNS; cycle++)
        {
            cubes = turn(cubes, true);
        }

        return cubes.size;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(input)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};
