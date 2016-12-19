module.exports = function() 
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require("../parser.js");

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day06.data')
    });

    var lights1 = [];
    var lights2 = [];

    readInput
    .on('line', (line) => { 
        executeInstruction(line);
    })
    .on('close', () => {
        console.log(litCount() + " lights are on");
        console.log("Total brightness is " + getTotalBrightness());
        process.exit(0);
    });
    
    function litCount()
    {
        var count = 0;

        for(var y = 0; y < 1000; y++)
            for (var x = 0; x < 1000; x++)
                if (getLight(x, y))
                    count++;

        return count;
    }

    function getTotalBrightness()
    {
        var brightness = 0;

        for(var y = 0; y < 1000; y++)
            for (var x = 0; x < 1000; x++)
                brightness += getBrightness(x, y);

        return brightness;
    }

    function getLight(x, y)
    {
        var row = lights1[y];
        if (row === undefined)
            return 0;
        return row[x] || 0;
    }

    function setLight(x, y, value)
    {
        var row = lights1[y];
        if (row === undefined)
            row = lights1[y] = [];
        row[x] = value;
    }

    function getBrightness(x, y)
    {
        var row = lights2[y];
        if (row === undefined)
            return 0;
        return row[x] || 0;
    }

    function changeBrightness(x, y, value)
    {
        var row = lights2[y];
        if (row === undefined)
            row = lights2[y] = [];

        var current = row[x] || 0;
        var brightness = current + value;
        if (brightness < 0)
            brightness = 0;
        row[x] = brightness;
    }

    function executeInstruction(line)
    {
        var parse = new parser(line);

        var command = parse.getToken();
        if (command == "turn")
            command = parse.getToken();
        else if (command != "toggle")
            throw "Invalid command";

        var x1 = parse.getNumber();
        parse.expectOperator(',');
        var y1 = parse.getNumber();
        parse.expectToken('through');
        var x2 = parse.getNumber();
        parse.expectOperator(',');
        var y2 = parse.getNumber();

        for(var x = x1; x <= x2; x++)
        {
            for (var y = y1; y <= y2; y++)
            {
                switch (command)
                {
                    case "on":
                        setLight(x, y, 1);
                        changeBrightness(x, y, 1);
                        break;

                    case "off":
                        setLight(x, y, 0);
                        changeBrightness(x, y, -1);
                        break;

                    case "toggle":
                        setLight(x, y, getLight(x, y) ? 0 : 1);
                        changeBrightness(x, y, 2);
                        break;

                    default:
                        throw "invalid operation";
                }
            }
        }
    }
}