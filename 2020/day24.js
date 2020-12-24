const day24 = module.exports = function()
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    const DIRECTIONS = {
        e:  { x:   1, y: 0 },
        se: { x: 0.5, y: 0.5 },
        sw: { x:-0.5, y: 0.5 },
        w:  { x:  -1, y: 0 },
        nw: { x:-0.5, y:-0.5 },
        ne: { x: 0.5, y:-0.5 },
    }

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const entries = [];

        for(const line of readFile(__filename))
        {
            const directions = [];
            for(let i = 0; i < line.length; i++) {
                switch (line[i]) {
                    case 'e': 
                        directions.push(DIRECTIONS.e);
                        break;
                        
                    case 'w':
                        directions.push(DIRECTIONS.w);
                        break;
                        
                    case 's':
                        if (line[i+1] === 'e')
                            directions.push(DIRECTIONS.se);
                        else if (line[i+1] === 'w')
                            directions.push(DIRECTIONS.sw);
                        else
                            throw "Invalid direction";
                        i++;
                        break;

                    case 'n':
                        if (line[i+1] === 'e')
                            directions.push(DIRECTIONS.ne);
                        else if (line[i+1] === 'w')
                            directions.push(DIRECTIONS.nw);
                        else
                            throw "Invalid direction";
                        i++;
                        break;

                    default:
                        throw "Invalid direction";
                }
            }

            entries.push(directions);
        }

        return entries;
    }

    function getNeighbours(tiles, noInit)
    {
        const neighbours = new Map();

        // initialize

        if (! noInit) {
            tiles.forEach(({X, Y}, tk) => 
                neighbours.set(tk, {
                    X,
                    Y,
                    count: 0,
                    black: true,
                })
            );
        }

        // calculate
        tiles.forEach(({X, Y}, tk) => {
            if (! neighbours.has(tk)) {
                neighbours.set(tk, {
                    X,
                    Y,
                    count: 0,
                    black: true,
                });
            }

            for(const key in DIRECTIONS) {
                const {x, y} = DIRECTIONS[key];

                const k = `${X+x}:${Y+y}`;
                const neighbour = neighbours.get(k);
                if (neighbour) {
                    neighbour.count++;
                } else {
                    neighbours.set(k, { 
                        X: X+x, 
                        Y: Y+y, 
                        count: 1,
                        black: tiles.has(k)
                    });
                }
            }
        });

        return neighbours;
    }

    function process(tiles)
    {
        const neighbours = new Map();

        tiles.forEach((tile, tileKey) => {
            if (! neighbours.has(tileKey)) {
                tile.count = 0;
                tile.black = true;
                neighbours.set(tileKey, tile);
            }

            const {X , Y} = tile;

            for(const key in DIRECTIONS) {
                const {x, y} = DIRECTIONS[key];

                const k = `${X+x}:${Y+y}`;
                const neighbour = neighbours.get(k);
                if (neighbour) {
                    neighbour.count++;
                } else {
                    neighbours.set(k, { 
                        X: X+x, 
                        Y: Y+y, 
                        count: 1,
                        black: tiles.has(k)
                    });
                }
            }
        });

        const output = new Map();

        neighbours.forEach((tile, key) => {
            if (tile.black) {
                if (tile.count > 0 && tile.count <= 2) {
                    output.set(key, tile);
                }
            } else if (tile.count === 2) {
                output.set(key, tile);
            }
        });

        return output;
    }

    function initialize()
    {
        const input = loadData();
        
        const tiles = new Map();

        for(const directions of input) 
        {
            let X = 0, Y = 0;

            for(const { x, y } of directions) 
            {
                X += x;
                Y += y;
            }

            const key = `${X}:${Y}`;
            if (tiles.has(key))
                tiles.delete(key);
            else
                tiles.set(key, { X, Y });
        }

        return tiles;
    }

    function part1()
    {
        const tiles = initialize();

        return tiles.size;
    }

    function part2()
    {
        let tiles = initialize();

        for(let day = 0; day < 100; day++) {
            tiles = process(tiles);
        }

        return tiles.size;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1()}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2()}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};
