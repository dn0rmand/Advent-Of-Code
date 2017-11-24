module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day19.data')
    });

    var characters = 0;
    var lines      = 0;

    readInput
    .on('line', (line) => { 
        characters += line.length;
        lines++;

        processLine(line);
    })
    .on('close', () => {
        console.log(characters + ' characters in ' + lines + " lines");
        process.exit(0);
    });

    function processLine(line)
    {
        console.log(line);
    }
}