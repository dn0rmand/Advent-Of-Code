module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day04.data')
    });

    let test = 1;
    let validCount1 = 0;
    let validCount2 = 0;
    
    readInput
    .on('line', (line) => { 
        if (line == '*')
            log();
        else
            processLine(line);
    })
    .on('close', () => {
        log();
        process.exit(0);
    });

    function log()
    {
        if (test == 1)
            console.log("PART 1: " + validCount1 + ' passphrases in test data');
        else if (test == 2)
            console.log("PART 2: " + validCount2 + ' passphrases in test data');
        else
        {
            console.log("PART 1: " + validCount1 + ' passphrases in puzzle data');
            console.log("PART 2: " + validCount2 + ' passphrases in puzzle data');
        }
        test++;
        validCount1 = 0;
        validCount2 = 0;
    }

    //
    // Slow but works. Keep it in case needed later on
    // 
    function addAnagrams(input, words)
    {
        function makeWords(first, rest)
        {
            if (rest.length == 0)
            {
                words[first] = 1;
                return;
            }

            for(let i = 0; i < rest.length; i++)
            {
                makeWords(first+rest[i], rest.substring(0, i) + rest.substring(i+1));
            }
        }

        makeWords('', input);
    }

    function processLine(line)
    {
        let words2 = {};
        let words1 = {};
        let parse = new parser(line);

        let valid1 = true;
        let valid2 = true;

        while (! parse.endOfLine() && (valid1 || valid2))
        {
            let token = parse.getToken();

            if (test != 2)
            {
                if (words1[token] !== undefined)
                {
                    valid2 = false;
                    valid1 = false;
                    break;
                } 
                else
                    words1[token] = 1;
            }

            if (test != 1 && valid2)
            {
                token = Array.from(token).sort().join('');
                if (words2[token] !== undefined)
                    valid2 = false;
                else
                    words2[token] = 1;
            }
        }

        if (valid1)
            validCount1++;
        if (valid2)
            validCount2++;
    }
}
