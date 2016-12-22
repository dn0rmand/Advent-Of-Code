module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day17.data')
    });

    readInput
    .on('line', (line) => { 
        parseInput(line.toLowerCase());
    })
    .on('close', () => {
        console.log("Data loaded");
        var n = calculateCombinations();
        console.log('\r' + n + ' possibilites');
        var min = containerKeys.length+1;
        var count = 0;
        var ks = Object.keys(solutions);
        for(var i = 0; i < ks.length; i++)
        {
            var x = solutions[ks[i]];
            if (x < min)
            {
                min = x;
                count = 1;
            }
            else if (x == min)
                count++;
        }
        console.log(count + ' ways to use only ' + min + ' containers');
        process.exit(0);
    });

    var totalLiters = 150;
    var id = 0;
    var containers = {};
    var containerKeys = [];

    var solutions = {} ;
    var solutionCount = 0;

    function calculateCombinations()
    {
        function subCalculate(key, liters, keys)
        {
            var size = containers[key];
            if (liters < size)
                return; // Not good

            if (liters == size)
            {
                // Good!
                var n = [];
                n.push(key);
                for(var i = 0 ; i < containerKeys.length ; i++)
                {
                    var k = containerKeys[i];
                    if (keys[k] !== undefined && k != key)
                        n.push(k);
                }
                var c = n.length;

                n = n.sort().join('_');
                if (solutions[n] === undefined)
                {
                    solutions[n] = c;
                    solutionCount++;
                    process.stdout.write('\r' + solutionCount);
                }
                return;
            }

            keys[key] = 1;

            for(var i = 0; i < containerKeys.length; i++)
            {
                var k = containerKeys[i];
                if (keys[k] === undefined)
                    subCalculate(k, liters - size, keys);
            }        

            keys[key] = undefined;
        }

        for(var i = 0; i < containerKeys.length; i++)
        {
            var k = containerKeys[i];
            subCalculate(k, totalLiters, {});
        }

        return solutionCount;
    }

    function parseInput(line)
    {
        var size = +line;
        var key = "K_" + (++id);
        containers[key] = size;
        containerKeys.push(key);
    }
}