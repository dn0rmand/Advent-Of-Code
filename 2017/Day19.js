//module.exports = 
(function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day19.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    const map = [];
    let x, y;

    function dumpResult()
    {
        solve();
    }

    function processLine(line)
    {
        let row = line.split(''); // convert to array
        map.push(row);
    }

    const DOWN = 1;
    const UP   = 2;
    const LEFT = 3;
    const RIGHT= 4;

    function solve()
    {
        let loot = '';
        let steps = 0;
        let direction = DOWN;
        let y = 0;
        let x = 0;
        // Find first position
        for (let i = 0; i < map[0].length; i++)
        {
            if (map[0][i] === '|')
            {
                x = i;
            }
        }
        if (map[y][x] !== '|')
            throw "Can't find the starting point"

        do
        {
            steps++;
        }
        while (move() === true) ;

        console.log('Part 1: ' + loot  + " (RUEDAHWKSM)");
        console.log('Part 2: ' + steps + " (17264)");

        function move()
        {
            let c = ' ';

            switch (direction)
            {
                case DOWN:
                {
                    c = get(x, ++y);
                    if (c === '+')
                        turn(x-1, y, LEFT, x+1, y, RIGHT);
                    break;
                }
                case UP:
                {
                    c = get(x, --y);
                    if (c === '+')
                        turn(x-1, y, LEFT, x+1, y, RIGHT);
                    break;
                }
                case RIGHT:
                {
                    c = get(++x, y);
                    if (c === '+')
                        turn(x, y-1, UP, x, y+1, DOWN);
                    break;
                }
                case LEFT:
                {
                    c = get(--x, y);                    
                    if (c === '+')
                        turn(x, y-1, UP,  x, y+1, DOWN);
                    break;
                }
            }
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
                loot += c;

            if (c === ' ')
                return false; // I'm done
            else
                return true;
        }

        function turn(x1, y1, d1, x2, y2, d2) // 2 possible directions
        {
            let c1 = get(x1, y1);
            let c2 = get(x2, y2);

            if ((c1 !== ' ' && c2 !== ' ') || (c1 === ' ' && c2 === ' ')) // ???? what way should I go ????
                throw "I don't know which way to go!";

            if (c1 !== ' ')
                direction = d1;
            else
                direction = d2;
        }

        function get(x, y)
        {
            if (y < map.length && x < map[y].length)
                return map[y][x];
            else
                return ' ';
        }
    }
})();