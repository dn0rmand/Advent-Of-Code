module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const consoleControl = require('console-control-strings')    

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day19.data')
    });

    var conversions = { };
    var decrypt     = { };
    var input;

    readInput
    .on('line', (line) => { 
        parseInput(line);
    })
    .on('close', () => {
        var molecules = calibrate(conversions, input);
        var result = molecules.length;
        console.log("PART1: " + result + " different molecules in 1 step");

        var steps = findShortestPath(input)
        console.log("PART2: " + steps + " steps to produce requested molecule");
        process.exit(0);
    });

    function calibrate(converter, input)
    {
        var molecules       = {}
        var $conversionKeys = Object.keys(converter);

        for (var i = 0; i < $conversionKeys.length; i++)
        {
            var search  = $conversionKeys[i];
            var convert = converter[search];
            var index   = input.indexOf(search);

            while (index >= 0)
            {
                for (var r = 0; r < convert.length ; r++)
                {
                    var molecule = input.substring(0, index) + convert[r] + input.substring(index+search.length);
                    molecules[molecule] = 1;
                }

                index = input.indexOf(search, index+1);
            }
        }

        return Object.keys(molecules);
    }

    function findShortestPath2(input)
    {
        function breadthFirst(molecules, step)
        {
            while (molecules.length > 0)
            {
                for(var i = 0 ; i < molecules.length; i++)
                    if (molecules[i] == 'e')
                        return step ; // Found it !!!
                step++;

                console.log(step + " -> " + molecules.length + " molecules to test");
                var newMol = {};

                for (var i = 0; i < molecules.length; i++)
                {
                    var mol = molecules[i];
                    var mols = calibrate(decrypt, mol);
                    for (var j = 0 ; j < mols.length; j++)
                        newMol[mols[j]] = 1;
                    mols = []; // Try to help GC
                }

                molecules = Object.keys(newMol);
                newMol = {}; // Try to help GC
            }

            return step;
        }

        return breadthFirst([input], 0); // Done 1 step already
    }

    function findShortestPath(input)
    {
        var minStep = 201;
        var visited = {};
        var count   = 0;
        var maxDepth;

        function deepSearch(molecule, step)
        {
            if (minStep !== undefined && step >= minStep)
                return false; 
            
            if (molecule === 'e')
            {
                minStep = step;
                console.log('');
                console.log('So far ' + step + ' is the minimum.')
                console.log('');
                return true;
            }

            if (visited[molecule] !== undefined)
                return false;

            visited[molecule] = 1;
            
            var keys = calibrate(decrypt, molecule);

            // keys.sort(function(v1,v2) {
            //     return v1.length - v2.length;
            // });

            for (var i = 0; i < keys.length; i++)
            {
                if (deepSearch(keys[i], step + 1) == true)
                    break;
            }

            return false;
        }

        deepSearch(input, 0);
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
