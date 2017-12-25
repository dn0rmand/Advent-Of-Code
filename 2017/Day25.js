module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day25.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    const rules = new Map();

    // Parsing status
    let parsingState;
    let currentRule;
    let steps = 0;

    function processLine(line)
    {
        line = line.trim().replace('.','');

        if (line.startsWith("Begin in state "))
            current = line[15];
        else if (line.startsWith('Perform a diagnostic checksum after '))
        {
            line = line.substring(36).replace('steps', '').trim();
            steps = +line;
        }
        else if (line.startsWith('In state '))
        {
            parsingState = line[9];
            rules[parsingState] = [];
        }
        else if (line === 'If the current value is 0:')
        {
            currentRule = {
                value: 0,
                direction: 1,
                continueWith: 'A'
            };
            rules[parsingState][0] = currentRule;            
        }
        else if (line === 'If the current value is 1:')
        {
            currentRule = {
                value: 0,
                direction: 1,
                continueWith: 'A'
            };
            rules[parsingState][1] = currentRule;            
        }
        else if (line.startsWith('- Write the value '))
        {
            currentRule.value = +(line[line.length-1]);
        }
        else if (line.startsWith('- Move one slot to the '))
        {
            let d = line.substring(23)[0].toUpperCase();            

            currentRule.direction = d === 'R' ? 1 : -1;
        }
        else if (line.startsWith('- Continue with state '))
        {
            currentRule.continueWith = line[line.length-1];
        }
    }
          
    function dumpResult()
    {
        let checksum = 0;
        let current = 'A';
        let position = 5000;
//        let min = position, max = position;

        const values = new Map();

        for(let i = 0; i < steps; i++)
        {
            let rule  = rules[current];
            let value = values[position] || 0;         
            let r     = rule[value];

            if (value !== r.value)
            {
                values[position] = r.value;
                checksum = checksum - value + r.value;
            }

            position += r.direction;
            current = r.continueWith;
            // if (position < min)
            //     min = position;
            // else if (position > max)
            //     max = position;
        }

        // console.log(min + ' to ' + max);
        console.log("Part 1: Checksum is " + checksum + " (2794) after " + steps + " steps");
    }
}
