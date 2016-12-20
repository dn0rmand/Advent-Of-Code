module.exports = function() 
{
    const assert = require('assert');
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day12.data')
    });

    var _JSON = "";

    readInput
    .on('line', (line) => { 
        _JSON += line;
    })
    .on('close', () => {
        var obj = JSON.parse(_JSON);
        var sum = calculateSum(obj);
        console.log("Sum of all numbers is " + sum);
        process.exit(0);
    });

    function calculateSum(json)
    {
        var total = 0;

        if (Array.isArray(json)) 
        {
            for(var i = 0; i < json.length; i++)
                total += calculateSum(json[i]);
        }
        else if (typeof json == 'object') 
        {
            var hasRed = false;
            Object.keys(json).forEach((k) =>
            {
                if (json[k] == "red")
                    hasRed = true;
            });

            if (! hasRed)
            {
                Object.keys(json).forEach((k) =>
                {
                    total += calculateSum(json[k]);                
                });
            }
        }
        else if (typeof json == "number")
        {
            total += json;
        }
        else
        {
            var i = +json;
            if (isFinite(i))
                total += i;
        }

        return total;
    }
}