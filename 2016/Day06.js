module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
    input: fs.createReadStream('Data/Day06.data')
    });

    var input = [];

    readInput
    .on('line', (line) => { processLine(line); })
    .on('close', () => {
        sort();

        console.log("Done ... Result is ....");
        console.log(input.join(''));
        process.exit(0);
    });

    function processLine(line)
    {
        for(var i = 0; i < line.length; i++)
        {
            var c = line[i];
            var l = input[i];
            if (l == null)
                l = input[i] = {};
            l[c] = (l[c] || 0)+1; 
        }
    }

    function sort()
    {
        for(var i = 0; i < input.length; i++)
        {
            var x = Object.keys(input[i]).sort(function(a, b) {
                return input[i][a] - input[i][b];
            });     
            input[i] = x[0];   
        }
    }
}