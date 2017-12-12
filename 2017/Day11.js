module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day11.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    function dumpResult()
    {
    }

    function processLine(line)
    {
        let position = {
            x: 0, 
            y: 0, 
            z: 0
        };

        function move(x, y, z)
        {
            position.x += x;
            position.y += y;
            position.z += z;
        }

        function getDistance()
        {
            let a = position;
            let b = { x: 0, y:0, z: 0};

            return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
        }

        let distance = 0, maxDistance = 0;
                
        line.split(',').forEach(s => 
        {
            switch(s)
            {
                case 'n' : move(  0,  1, -1); break;
                case 's' : move(  0, -1,  1); break;
                case 'ne': move(  1,  0, -1); break;
                case 'nw': move( -1,  1,  0); break;
                case 'se': move(  1, -1,  0); break;
                case 'sw': move( -1,  0,  1); break;

                default:
                    console.log('direction not supported');
                    break;
            }

            maxDistance = Math.max(maxDistance, getDistance());
        });

        distance = getDistance();

        console.log('Distance = ' + distance + ' - Max is ' + maxDistance);
    }
}
