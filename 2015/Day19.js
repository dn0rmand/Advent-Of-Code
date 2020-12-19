const day19 = function() 
{
    const fs        = require('fs');
    const readline  = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day19.data')
    });

    var conversions = { };
    var decrypt     = { };
    var input;

    readInput
    .on('line', (line) => { 
        parseInput(line);
    })
    .on('close', () => {
        var result = calibrate(conversions, input);
        console.log("PART1: " + result + " different molecules in 1 step");

        var steps = findShortestPath(input)
        console.log("PART2: " + steps + " steps to produce requested molecule");
        process.exit(0);
    });

    function calibrate(converter, input)
    {
        const molecules = new Set();

        for (const molecule of search(converter, input))
        {
            molecules.add(molecule);
        }

        return molecules.size;
    }

    function *search(converter, input)
    {
        if (converter.$keys === undefined) 
            converter.$keys = Object.keys(converter);

        for (let i = 0; i < converter.$keys.length; i++)
        {
            const search  = converter.$keys[i];
            let index   = input.indexOf(search);
            const convert = converter[search];
            const slen    = search.length;

            while (index >= 0)
            {
                for (let r = 0; r < convert.length ; r++)
                {
                    const molecule = input.substring(0, index) + convert[r] + input.substring(index+slen);
                    yield molecule;
                }
                index = input.indexOf(search, index+1);
            }
        }
    }

    function findShortestPath(molecule)
    {
        let steps = 0;
        let states = [molecule];
        
        while(states.length > 0)
        {
            ++steps;

            const newStates = [];

            for(const molecule of states)
            {
                for(const newMolecule of search(decrypt, molecule))
                {
                    if (newMolecule === 'e')
                    {
                        return steps;
                    }

                    newStates.push(newMolecule);
                }
            }

            states = newStates.sort((a, b) => a.length - b.length).slice(0, 100);
        }

        throw "NOT FOUND";
    }

    function setValue(obj, key, value)
    {
        if (obj[key] === undefined)
            obj[key] = [];
        obj[key].push(value);
    }

    function parseInput(line)
    {
        var s = line.split('=>');
        if (s.length == 2)
        {
            setValue(conversions, s[0].trim(), s[1].trim());
            setValue(decrypt    , s[1].trim(), s[0].trim());
        }
        else if (s.length == 1)
            input = line.trim();
        else if (line.trim().length != 0)
            throw "invalid input";
    }
}

module.exports = day19;
