function loadData()
{
    const readFile = require("advent_tools/readfile");

    const entries = [];

    for(const line of readFile(__filename))
    {
        entries.push(line.split(''));
    }

    return entries;
}

function part1()
{
    let state = loadData();

    const height= state.length;
    const width = state[0].length;

    function countAdjacent(x, y)
    {
        function occupied(ox, oy)
        {
            ox += x;
            oy += y;
            if (ox < 0 || oy < 0 || ox >= width || oy >= height)
                return 0;

            return state[oy][ox] === '#';
        }

        const count = occupied(-1,-1) + 
                      occupied( 0,-1) + 
                      occupied( 1,-1) +
                      occupied(-1, 0) +
                      occupied( 1, 0) +
                      occupied(-1, 1) + 
                      occupied( 0, 1) + 
                      occupied( 1, 1);
   
        return count;
    }

    let modified = true;
    let occupied = 0;

    while(modified)
    {
        modified = false;
        occupied = 0;

        const newState = new Array(height);
        for(let y = 0; y < height; y++)
        {
            const source = state[y];
            const destin = new Array(width);

            for(let x = 0; x < width; x++)
            {
                switch(source[x]) {
                    case '#':
                        if (countAdjacent(x, y) >= 4) {
                            destin[x] = 'L';
                            modified = true;
                        }
                        else {
                            destin[x] = '#';
                            occupied++;
                        }
                        break;

                    case 'L':
                        if (countAdjacent(x, y) === 0) {
                            destin[x] = '#';
                            modified = true;
                            occupied++;
                        }
                        else {
                            destin[x] = 'L';
                        }
                        break;

                    case '.':
                        destin[x] = '.';
                        break;
                }
            }

            newState[y] = destin;
        }
        state = newState;
    }

    return occupied;
}

function part2()
{
    let state = loadData();

    const height= state.length;
    const width = state[0].length;

    function countVisible(x, y)
    {
        function seeOccupiedSeat(ox, oy)
        {
            while (true) 
            {
                x += ox;
                y += oy;

                if (x < 0 || x >= width || y < 0 || y >= height) 
                    break;

                const c = state[y][x];
                if (c === '#')
                    return 1;
                if (c !== '.')
                    break;
            }

            return 0;
        }

        let count = seeOccupiedSeat( 0, 1) +
                    seeOccupiedSeat( 0,-1) +
                    seeOccupiedSeat( 1, 0) +
                    seeOccupiedSeat(-1, 0) +
                    seeOccupiedSeat( 1, 1) +
                    seeOccupiedSeat( 1,-1) +
                    seeOccupiedSeat(-1, 1) +
                    seeOccupiedSeat(-1,-1);

        return count;
    }

    let modified = true;
    let occupied = 0;

    while(modified)
    {
        modified = false;
        occupied = 0;

        const newState = new Array(height);
        for(let y = 0; y < height; y++)
        {
            const source = state[y];
            const destin = new Array(width);

            for(let x = 0; x < width; x++)
            {
                switch(source[x]) {
                    case '#':
                        if (countVisible(x, y) >= 5) {
                            destin[x] = 'L';
                            modified = true;
                        }
                        else {
                            destin[x] = '#';
                            occupied++;
                        }
                        break;

                    case 'L':
                        if (countVisible(x, y) === 0) {
                            destin[x] = '#';
                            modified = true;
                            occupied++;
                        }
                        else {
                            destin[x] = 'L';
                        }
                        break;

                    case '.':
                        destin[x] = '.';
                        break;
                }
            }

            newState[y] = destin;
        }
        state = newState;
    }

    return occupied;
}

console.log('--- Advent of Code day 11 ---');

console.time('Day11-1');
console.log(`Part 1: ${part1()}`);
console.timeLog('Day11-1', 'to execute part 1 of day 11');

console.time('Day11-2');
console.log(`Part 2: ${part2()}`);
console.timeLog('Day11-2', 'to execute part 2 of day 11');
