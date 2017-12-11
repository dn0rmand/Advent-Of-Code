// module.exports =
(function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day11.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    let distance = 0, maxDistance = 0;

    function dumpResult()
    {
        console.log("Distance = " + distance);
        console.log("Max Distance is " + maxDistance);
    }

    function processLine(line)
    {
        let x = 0, y = 0;

        line.split(',').forEach(s => {
            switch(s)
            {
                case 'n': y++; break;
                case 's': y--; break; 
                case 'w': x--; break;
                case 'e': x++; break;

                case 'ne': y++; x++; break;
                case 'nw': y++; x--; break;
                case 'se': y--; x++; break;
                case 'sw': y--; x--; break;

                default:
                    console.log('direction not supported');
                    break;
            }

            maxDistance = Math.max(maxDistance, Math.abs(x), Math.abs(y));
        });

        distance = Math.max( Math.abs(x), Math.abs(y));
    }
})();
