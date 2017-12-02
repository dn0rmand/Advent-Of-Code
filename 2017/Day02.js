module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day02.data')
    });

    var checksum1 = 0;
    var checksum2 = 0;
    var dataSet   = 1;

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        logResult();
        process.exit(0);
    });

    function processLine(line)
    {        
        if (line == '*')
        {
            logResult();
            return;
        }

        var data = [];
        var parse = new parser(line);

        while(! parse.endOfLine())
        {
            var c = parse.getValue();
            if (! typeof c == 'Number')
                throw 'Invalid number';
            data.push(c);
        }
        
        if (dataSet != 2) 
            checksum1 += calculateChecksum1(data);
        if (dataSet != 1)
            checksum2 += calculateChecksum2(data);
    }

    function calculateChecksum1(data)
    {
        var max   = Number.MIN_SAFE_INTEGER, min=Number.MAX_SAFE_INTEGER;
        var count = data.length;

        for(var i = 0; i < count; i++)
        {
            var value = data[i];

            max = Math.max(value, max);
            min = Math.min(value, min);
        }

        return (max - min);
    }
    
    function calculateChecksum2(data)
    {
        var count = data.length;

        for(var i = 0; i < count; i++)
        {
            var value1 = data[i];

            for(var j = i+1; j < count; j++)
            {
                var value2 = data[j];
                var result = Math.max(value1, value2) / Math.min(value1, value2);

                if (Math.round(result) == result)
                    return result;
            }
        }     
        
        throw "Didn't find two evenly divisible values";
    }

    function logResult()
    {
        var prefix;

        if (dataSet == 1)
            console.log('Test data for part 1 => Checksum is ' + checksum1);
        else if (dataSet == 2)
            console.log('Test data for part 2 => Checksum is ' + checksum2);
        else
            console.log('Real data => checksums are ' + checksum1 + ' and ' + checksum2);

        checksum1 = 0;
        checksum2 = 0;
        dataSet++;
    }
}