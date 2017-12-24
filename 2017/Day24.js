const day24 = module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day24.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    let components = {};
    let valueKeys  = {

    };
    
    function processLine(line)
    {
        function set(start, key)
        {
            if (valueKeys[start] === undefined)
                valueKeys[start] = [key];
            else
                valueKeys[start].push(key);
        }

        let values = line.split('/');
        values[0] = +(values[0]);
        values[1] = +(values[1]);

        components[line] = values;

        set(values[0], line);
        if (values[0] !== values[1])
            set(values[1], line);
    }

    function dumpResult()
    {
        let used      = {};
        let maxValues = [];
        let maxTotal  = 0;
//        let keys      = Object.keys(components);
//        let keysLength= keys.length;

        function buildBriges(endValue, total, count)
        {
            maxTotal = Math.max(total, maxTotal);
            if (maxValues[count] === undefined || maxValues[count] < total)
                maxValues[count] = total;

            let keys = valueKeys[endValue];
            let keysLength = keys.length;
            for (let index = 0; index < keysLength; index++)
            {
                let key = keys[index];
                if (used[key] === undefined)
                {
                    let component = components[key];
                    let newEnd = (component[0] === endValue ? component[1] : 
                                    (component[1] === endValue ? component[0] : -1));

                    if (newEnd !== -1)
                    {
                        used[key] = 1;
                        buildBriges(newEnd, total + component[0] + component[1], count+1);
                        delete used[key];        
                    }
                }
            }
        }

        buildBriges(0, 0, 0);

        console.log('Part 1: ' + maxTotal + " (1906)");
        console.log('Part 2: ' + maxValues[maxValues.length-1] + " (1824)")
    }
};

//day24();