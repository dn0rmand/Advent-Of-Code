module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const consoleControl = require('console-control-strings')    

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
        var molecules = calibrate(conversions, input);
        var result = molecules.length;
        console.log("PART1: " + result + " different molecules in 1 step");

        var steps = findShortestPath(input)
        console.log("PART2: " + steps + " steps to produce requested molecule");
        process.exit(0);
    });

    function calibrate(converter, input)
    {
        var molecules = {}

        search(converter, input, function(molecule) {
            molecules[molecule] = 1;
        });

        return Object.keys(molecules);
    }

    function search(converter, input, callback)
    {
        if (converter.$keys === undefined) 
            converter.$keys = Object.keys(converter);

        for (var i = 0; i < converter.$keys.length; i++)
        {
            var search  = converter.$keys[i];
            var index   = input.indexOf(search);
            var convert = converter[search];
            var slen    = search.length;

            while (index >= 0)
            {
                for (var r = 0; r < convert.length ; r++)
                {
                    var molecule = input.substring(0, index) + convert[r] + input.substring(index+slen);

                    callback(molecule);
                }
                index = input.indexOf(search, index+1);
            }
        }
    }

    function findShortestPath(input)
    {
        var minStep = 205;
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

            var v = visited[molecule];
            if (v !== undefined && v <= step)
                return false;
            visited[molecule] = step;
            
           if (typeof(global.gc) == "function")
                global.gc();

            search(decrypt, molecule, function(molecule) {                
                deepSearch(molecule, step+1);
            });

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