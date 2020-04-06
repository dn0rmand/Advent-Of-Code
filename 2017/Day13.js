module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day13.data')
    });

    const sleep = require("atomic-sleep");
    const consoleControl = require('console-control-strings');
    
    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    const layers = [];
    let maxRange = 0;

    function DrawScreen(final, myPosition, time)
    {
        function newLine()
        {
            for(let depth = 0; depth < layers.length; depth++)
                process.stdout.write(' ');        

            process.stdout.write('  ');        
            process.stdout.write(consoleControl.nextLine(1));                
        }

        const color = "brightWhite";

        process.stdout.write(consoleControl.hideCursor());
        process.stdout.write(consoleControl.color(color));
        process.stdout.write(consoleControl.color('bgBlack'));

        newLine();

        for(var y = 1; y <= maxRange; y++)
        {
            if (y === 1 && myPosition < 0)
            {
                process.stdout.write(consoleControl.color("brightRed"));
                process.stdout.write('✺');                
                process.stdout.write(consoleControl.color(color));            
            }
            else
                process.stdout.write(' ');

            for(var depth = 0; depth < layers.length; depth++)
            {
                var range   = layers[depth];
                var position= calculatePosition(range, time);
                if (position == y)
                {
                    process.stdout.write('#');
                }
                else if (depth == myPosition && y == 1)
                {
                    process.stdout.write(consoleControl.color("brightRed"));
                    process.stdout.write('✺');                
                    process.stdout.write(consoleControl.color(color));
                }
                else
                    process.stdout.write(' ');                
            }

            if (y === 1 && myPosition >= layers.length)
            {
                process.stdout.write(consoleControl.color("brightRed"));
                process.stdout.write('✺');                
                process.stdout.write(consoleControl.color(color));            
            }
            else
                process.stdout.write(' ');
            process.stdout.write(consoleControl.nextLine(1));    
        }    

        newLine();

        process.stdout.write(consoleControl.color('reset'));

        if (final !== true) 
        {
            let backCode = '\x1b[' + (2+maxRange) + 'A'; // consoleControl.previousLine(num = 1);
            process.stdout.write(backCode);
            sleep(80);            
        }

        process.stdout.write(consoleControl.showCursor());
    }

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

        let time = delay-50;

        while (time < delay)
            DrawScreen(false, -1, time++);

        for(let position = 0 ; position < layers.length ; position++)
            DrawScreen(false, position, time++);

        DrawScreen(true, layers.length, time++);
    }

    function processLine(line)
    {
        let parse = new parser(line);
        let depth = parse.getNumber();
        parse.expectOperator(':');
        let range = parse.getNumber();

        layers[depth] = range; 

        maxRange = Math.max(range, maxRange);
    }
}