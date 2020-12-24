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

    function makeKey(X, Y)
    {
        const value = ((Math.abs(X) * 100 + Math.abs(Y)) * 4) + (X < 0 ? 1 : 0) + (Y < 0 ? 2 : 0);
        return value;
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

    function process(tiles)
    {
        const neighbours = [];

        tiles.forEach(({X, Y}) => {
            for(const key in DIRECTIONS) {
                const direction = DIRECTIONS[key];
                const xx = X + direction.x;
                const yy = Y + direction.y;

                const k = ((Math.abs(xx) * 100 + Math.abs(yy)) * 4) + (xx < 0 ? 1 : 0) + (yy < 0 ? 2 : 0);

                const neighbour = neighbours[k];
                if (neighbour) {
                    neighbour.count++;
                } else {
                    neighbours[k]= { 
                        X: xx, 
                        Y: yy, 
                        count: 1,
                        black: tiles[k] !== undefined
                    };
                }
            }
        });

        tiles = [];

        neighbours.forEach((tile, key) => {
            if (tile.black) {
                if (tile.count > 0 && tile.count <= 2) {
                    tiles[key] = tile;
                }
            } else if (tile.count === 2) {
                tiles[key] = tile;
            }
        });

        return tiles;
    }

    function initialize()
    {
        const input = loadData();
        
        const tiles = [];

        for(const directions of input) 
        {
            let X = 0, Y = 0;

            for(const { x, y } of directions) 
            {
                X += x;
                Y += y;
            }

            const key = ((Math.abs(X) * 100 + Math.abs(Y)) * 4) + (X < 0 ? 1 : 0) + (Y < 0 ? 2 : 0);

            if (tiles[key]) {
                delete tiles[key];
            } else {
                tiles[key] = { X, Y };
            }
        }

        return tiles;
    }

    function part1()
    {
        const tiles = initialize();

        return { tiles, count: tiles.reduce(a => a+1, 0) };
    }

    function part2(tiles)
    {
        for(let day = 0; day < 100; day++) {
            
            tiles = process(tiles);
        }

        return tiles.reduce(a => a+1, 0);
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-part-1`);
    
    const { tiles, count } = part1();

    console.log(`Part 1: ${ count }`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(tiles)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};
