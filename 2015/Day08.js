module.exports = function() 
{
    const assert = require('assert');
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day08.data')
    });

    var codeCount = 0;
    var memoryCount = 0;
    var escapedCount=0;

    readInput
    .on('line', (line) => { 
        codeCount += line.length;
        unescapeLine(line); 
        escapeLine(line); 
    })
    .on('close', () => {
        console.log("Difference between code length and memory length is " + (codeCount - memoryCount));
        console.log("Difference between escaped length and code length is " + (escapedCount - codeCount));
        process.exit(0);
    });

    function unescapeLine(line)
    {
        var l = global.eval(line);
        memoryCount += l.length;
    }

    function escapeLine(line)
    {
        var count = line.length + 4;
        var l = '"\\"';
        for(var i = 1; i < line.length-1; i++)
        {
            l += line[i];
            if (line[i] == '\\')
            {
                l += '\\'
                count++;
                if (i < line.length-2 && line[i+1] == '"')
                {
                    l += '\\';
                    count++;
                }
            }
        }
        l += '\\""';

        assert(count == l.length, "Length should be equal");
        var l2 = global.eval(l);
        assert(line == l2, "Strings should be equal");
        escapedCount += count;
    }
}