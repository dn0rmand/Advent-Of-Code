module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day02.data')
    });

    let checksum1 = 0;
    let checksum2 = 0;
    let dataSet   = 1;

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

        let data = [];
        let parse = new parser(line);

        while(! parse.endOfLine())
        {
            let c = parse.getNumber(true);
            data.push(c);
        }
        
        if (dataSet != 2) 
            checksum1 += calculateChecksum1(data);
        if (dataSet != 1)
            checksum2 += calculateChecksum2(data);
    }

    function calculateChecksum1(data)
    {
        let max   = Number.MIN_SAFE_INTEGER, min=Number.MAX_SAFE_INTEGER;
        let count = data.length;

        for(let i = 0; i < count; i++)
        {
            let value = data[i];

            max = Math.max(value, max);
            min = Math.min(value, min);
        }

        return (max - min);
    }
    
    function calculateChecksum2(data)
    {
        let count = data.length;

        for(let i = 0; i < count; i++)
        {
            let value1 = data[i];

            for(let j = i+1; j < count; j++)
            {
                let value2 = data[j];
                let result = Math.max(value1, value2) / Math.min(value1, value2);

                if (Math.round(result) == result)
                    return result;
            }
        }     
        
        throw "Didn't find two evenly divisible values";
    }

    function logResult()
    {
        let prefix;

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