const day06 = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require("../tools/parser.js");

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day06.data')
    });

    let input = [];

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        solve();
        process.exit(0);
    });

    function processLine(line)
    {
        let parse = new parser(line);
        while (! parse.endOfLine())
            input.push(parse.getNumber(true));
    }

    function solve()
    {
        let steps = 0;
        let size = 0;
        let keys = {};
        while (true)
        {
            steps++;
            // Find Max block
            let max = -1;
            let maxIndex = -1;
            for(let i =0; i<input.length;i++)
            {
                if (input[i] > max)
                {
                    max = input[i];
                    maxIndex = i;
                }
            }
            // Update blocks
            input[maxIndex] = 0;
            while (max-- > 0)
            {
                maxIndex = (maxIndex+1) % input.length;
                input[maxIndex]++;
            }
            // Make Key
            var k = input.toString();
            if (keys[k] !== undefined)
            {
                size = steps - keys[k];
                break;
            }
            keys[k] = steps;
        }
        console.log("PART 1 RESULT = " + steps);
        console.log("PART 2 RESULT = " + size);
    }
}

module.exports = day06;

//day06();