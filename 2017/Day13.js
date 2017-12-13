//module.exports = 
(function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day13.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    const layers = [];

    function calculatePosition(range, pico)
    {
        pico %= (range + range - 2);

        if (pico < range)
        {
            return pico+1;
        }
        else
        {
            pico -= range;
            return range - (pico + 1);
        }
    }

    function tryPass(delay, stopIfCaught)
    {
        let cost = 0;

        for(let depth = 0; depth < layers.length; depth++)
        {
            let range = layers[depth];
            if (range === undefined)
                continue;

            let position = calculatePosition(range, depth+delay);

            if (position === 1) // Caught!
            {
                if (stopIfCaught === true)
                    return -1;
                    
                cost += depth * range;
            }
        }

        return cost;
    }

    function dumpResult()
    {
        solve1();
        solve2();
    }

    function solve1()
    {
        let cost = tryPass(0); // returns the actual cost
        console.log("Part 1: Cost is " + cost);
    }

    function solve2()
    {
        let delay = 0;
        let cost = tryPass(0, true); // returns -1 when caught because of 'true' parameter ( stopIfCaught )

        while (cost < 0)
        {
            delay++;
            cost = tryPass(delay, true); // returns -1 when caught because of 'true' parameter ( stopIfCaught )
        }

        console.log("Part 2: Delay to not get caugth is " + delay);
    }

    function processLine(line)
    {
        let parse = new parser(line);
        let depth = parse.getNumber();
        parse.expectOperator(':');
        let range = parse.getNumber();

        layers[depth] = range; 
    }
})();