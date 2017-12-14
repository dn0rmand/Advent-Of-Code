module.exports = function()
{
    //#region FWK - Read file and load required modules
    const knotHashes = require('../tools/knotHashes.js');
    let knotHash = new knotHashes();

    const testInput = 'flqrgnkx';
    const puzzleInput = 'ffayrhll';
    
    const diskSize = 128;
    const hexMap = {
        'a': 10,
        'b': 11,
        'c': 12,
        'd': 13,
        'e': 14,
        'f': 15,
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9
    };

    let disk;
    
    // runTest();
    solvePuzzle();

    process.exit(0);

    function runTest()
    {
        disk = solve1(testInput);
        printDisk(disk);
        solve2(disk);
        verifyDisk(disk);
    }

    function solvePuzzle()
    {
        let disk = solve1(puzzleInput);
        solve2(disk);
    }

    function solve1(input)
    {
        let count=0;
        let disk = [];

        formatDisk(disk);
        for(let y = 0; y < diskSize; y++)
        {
            let hash = knotHash.getKnotHash(input + '-' + y);
            let x = 0;
            for(let i = 0; i < 32; i++)
            {
                let bits = hexMap[hash[i]].toString(2);
                while (bits.length < 4)
                    bits = '0' + bits;
                for(let b = 0; b < 4; b++)
                {
                    if (bits[b] === '1')
                    {
                        count++;
                        disk[y][x] = 1;
                    }
                    x++;
                }
            }
        }

        console.log("Part 1: " + count + " ones");

        return disk;
    }

    function solve2(disk)
    {
        function clearRegion(x, y, region)
        {
            disk[y][x] = region.toString();

            if (x < diskSize-1 && disk[y][x+1] === 1)
                clearRegion(x+1, y, region);
            if (x > 0 && disk[y][x-1] === 1)
                clearRegion(x-1, y, region);
            if (y > 0 && disk[y-1][x] === 1)
                 clearRegion(x, y-1, region);
            if (y < diskSize-1 && disk[y+1][x] === 1)
                clearRegion(x, y+1, region);
        }

        let regions = 0;

        for (let y = 0; y < diskSize; y++)
        {
            for (let x = 0; x < diskSize; x++)
            {
                if (disk[y][x] === 1)
                {
                    regions++;
                    clearRegion(x, y, regions);
                }
            }
        }

        console.log("Part 2: " + regions + " regions found");
    }

    function formatDisk(disk)
    {
        for (let y = 0; y < diskSize; y++)
        {
            disk[y] = [];
            for(let x = 0; x < diskSize; x++)
                disk[y][x] = 0;
        }
    }
    
    function verifyDisk(disk)
    {
        for (let y = 0; y < diskSize; y++)
            for(let x = 0; x < diskSize; x++)
                if (disk[y][x] === 1)
                    throw "Found 1 at (" + y + "," + x + ")";
    }

    function printDisk(disk)
    {
        for (let y = 0; y < 8; y++)
        {
            let s = '';
            for (let x = 0; x < 8; x++)
            {
                s += disk[y][x] === 1 ? '#' : '.';
            }
            console.log(s);
        }
    }
};