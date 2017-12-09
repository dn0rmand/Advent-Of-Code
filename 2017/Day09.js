module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day09.data')
    });

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        process.exit(0);
    });

    function processLine(line)
    {
        let garbageCount = 0;
        let count = 0;
        let index = 0;
        let length= line.length;

        function processGarbage()
        {
            if (index < length && line[index] == '<')
            {
                index++;
                while (index < length)
                {
                    let c = line[index++];
                    if (c == '!')
                        index++; // Skip next character
                    else if (c == '>') // end of garbage
                        break;
                    else
                        garbageCount++;
                }
            }
        }

        function processGroup(score)
        {
            processGarbage();

            let count = 0;

            if (index < length && line[index] == '{')
            {
                index++;
                
                count = score + processGroups(score+1);

                if (index >= length || line[index] != '}')
                    throw "Invalid input";

                index++;
            }

            processGarbage();

            return count;
        }

        function processGroups(score)
        {
            let groupCount = processGroup(score);
            
            while (index < length && line[index] == ',')
            {
                index++;
                groupCount += processGroup(score);
            }

            return groupCount;
        }

        let lineValue = processGroups(1);

        console.log("Part 1: " + lineValue + " ( 11089 )");
        console.log("Part 2: " + garbageCount + " ( 5288 )");
    }
}
