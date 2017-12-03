module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day01.data')
    });

    let part = 1;
    
    console.log("----- part 1 -----");

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        process.exit(0);
    });

    function processLine(line)
    {
        let total = 0;
        let count = line.length;
        let offset= 1;

        if (line == "*")
        {
            console.log("----- part 2 -----");
            part = 2;
            return;
        }

        if (part == 2)
            offset = count/2;

        for (let i = 0; i < count; i++)
        {
            let c1 = line.charAt(i);
            let c2 = line.charAt((i+offset) % count);
            if (c1 == c2)
                total += +c1;
        }
        console.log("Total = " + total);
    }
}