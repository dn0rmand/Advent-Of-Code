module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day05.data')
    });

    let input1 = [];
    let input2 = [];

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        jump(input1, false)
        jump(input2, true);

        process.exit(0);
    });

    function processLine(line)
    {
        let n = +line;
        
        if (isNaN(n))
            throw 'invalid data';
        input1.push(n);
        input2.push(n);
    }

    function jump(input, part2)
    {
        let current = 0;
        let steps = 0;

        let count = input.length;
        
        while(current < count && current >= 0)
        {
            steps++;
            let offset = input[current];   
            if (part2 && offset >= 3)
                input[current]--;         
            else
                input[current]++;
            current += offset;
        }
        console.log((part2 ? 'Part 2' : 'Part 1') + ' executed in ' + steps + ' steps');
    }
}
