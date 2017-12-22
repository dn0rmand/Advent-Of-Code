const day22 = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day22.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    function dumpResult()
    {
        solve1();
        solve2();
    }

    function processLine(line)
    {
        PuzzleInput.push(line.split(''));
    }

    const PuzzleInput = [];    

    function PuzzleMap(puzzle)
    {
        const directions = [
            { x: 0, y:-1 }, // UP
            { x: 1, y: 0 }, // RIGHT
            { x: 0, y: 1 }, // DOWN
            { x:-1, y: 0 }  // LEFT
        ];

        this.direction  = 0; // UP
        this.infections = 0;
        this.data       = new Map();//[];

        this.turnRight = function()
        {
            this.direction = (this.direction+1) & 3;
        };

        this.turnLeft = function()
        {
            this.direction = (this.direction-1);
            if (this.direction < 0)
                this.direction = 3;
        };

        this.reverseDirection = function()
        {
            this.direction = (this.direction+2) & 3;
        };

        this.move = function()
        {
            let m = directions[this.direction];

            this.x += m.x;
            this.y += m.y;
        };

        let max = Number.MIN_VALUE;
        let min = Number.MIN_VALUE;

        function makeKey(x, y)
        {
/*          
            // Gives around 201x167, so 1000 should be safe  

            if (x > max)
            {
                max = x;
                console.log("MAX: " + max);
            }
            if (x < min)
            {
                min = x;
                console.log("MIN: " + min);
            }
*/
            // Add 500 to make sure x and y are positive before doing bit stuff.

            return ((y + 1000) << 16) | (x + 1000);
        }

        this.set = function(x, y, value)
        {
            if (value === '#')
                this.infections++;
            
            this.data.set(makeKey(x,y), value);
        };

        this.get = function(x, y)
        {
            let c = this.data.get(makeKey(x,y));

            if (c === undefined)
                c = '.';
            return c;
        };

        this.doPart1 = function()
        {
            let c = this.get(this.x, this.y);
            if (c === '#')
            {
                this.turnRight();
                this.set(this.x, this.y, '.');
            }
            else
            {
                this.set(this.x, this.y, '#');
                this.turnLeft();
            }
            this.move();
        };
        
        this.doPart2 = function()
        {
            let c = this.get(this.x, this.y);
            if (c === '#')
            {
                this.turnRight();
                this.set(this.x, this.y, 'F');
            }
            else if (c === 'W')
            {
                this.set(this.x, this.y, '#');
            }
            else if (c === 'F')
            {
                this.set(this.x, this.y, '.');
                this.reverseDirection();
            }
            else
            {
                this.set(this.x, this.y, 'W');
                this.turnLeft();
            }
            this.move();
        };

        let height = puzzle.length;
        let width  = 0;

        for (let y = 0; y < height; y++)
        {
            let row = puzzle[y];
            if (row.length > width)
                width = row.length;

            for(let x = 0; x < row.length; x++)
                this.set(x, y, PuzzleInput[y][x]);
        }

        this.x = Math.floor(width / 2);
        this.y = Math.floor(height / 2);

        return this;
    }

    function solve1()
    {
        let map = new PuzzleMap(PuzzleInput);
        map.infections = 0;

        for(let i = 0; i < 10000; i++)
        {
            map.doPart1();
        }

        console.log("Part 1: " + map.infections + " (5369)");
    }

    function solve2()
    {
        let map = new PuzzleMap(PuzzleInput);
        map.infections = 0;

        for(let i = 0; i < 10000000; i++)
        {
            map.doPart2();
        }

        console.log("Part 2: " + map.infections + " (2510774)");
    }
};

module.exports = day22;

// day22();