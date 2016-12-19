module.exports = function() 
{
    const assert = require('assert');
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day09.data')
    });

    readInput
    .on('line', (line) => { 
        parseInput(line.toLowerCase());
    })
    .on('close', () => {
        calculate();
        process.exit(0);
    });

    var segments = {
    };

    var locations = { };

    function getLocation(name)
    {
        var location = locations[name];
        if (location === undefined)
        {
            location = locations[name] = []; // Array of {name, distance}
        }
        return location;
    }

    function parseInput(line)
    {
        var parse = new parser(line);

        var start = parse.getToken();
        parse.expectToken('to');
        var end = parse.getToken();
        parse.expectOperator('=');
        var distance = parse.getNumber();

        var key1 = start + "_" + end;
        var key2 = end + "_" + start;

        assert(segments[key1] === undefined);
        assert(segments[key1] === undefined);

        segments[key1] = {};
        segments[key2] = {};

        getLocation(start).push({ name:end, distance:distance });
        getLocation(end).push({ name:start, distance:distance });
    }

    var minDistance = undefined;
    var maxDistance = undefined;
    var cities      = undefined;

    function calculate2(city, distance, visited, step)
    {        
        visited[city] = step;
        visited.$count++;

        if (visited.$count == cities.length) 
        {            
            if (minDistance === undefined)
                minDistance = distance;
            else
                minDistance = Math.min(distance, minDistance);
            if (maxDistance === undefined)
                maxDistance = distance;
            else
                maxDistance = Math.max(distance, maxDistance);
        }
        else
        {
            var location = getLocation(city);

            for(var i = 0; i < location.length; i++)
            {
                if (visited[location[i].name] === undefined)
                {                
                    calculate2(location[i].name, distance + location[i].distance, visited, step + 1);
                }
            }
        }

        visited.$count--;
        visited[city] = undefined;
    }

    function calculate()
    {
        cities = Object.keys(locations);

        for(var i = 0; i < cities.length; i++)
        {
            var start = cities[i];
            calculate2(start, 0, { $count:0 }, 0);
        }
        console.log("Min distance: " + minDistance);
        console.log("Max distance: " + maxDistance);
    }
}