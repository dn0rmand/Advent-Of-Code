module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const consoleControl = require('console-control-strings')    

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day18.data')
    });

    const width  = 100;
    const height = 100;
    const steps  = 100;

    var allowPrint = false;

    var screen1     = [];
    var screen2     = [];
    var currentScreen = screen1;

    readInput
    .on('line', (line) => { 
        parseInput(line);
    })
    .on('close', () => {
        var lightsOn = 0;

        for (var i = 0; i < steps; i++)
        {
            animateLights();
            setState(currentScreen, 0, 0, 1);
            setState(currentScreen, 0, height-1, 1);
            setState(currentScreen, width-1, 0, 1);
            setState(currentScreen, width-1, height-1, 1);
            lightsOn = printScreen(currentScreen);
        }
        print(consoleControl.down(100));
        console.log('')
        console.log(lightsOn + " lights are on");    
        process.exit(0);
    });

    function print(value)
    {
        if (allowPrint)
            process.stdout.write(value);
    }

    function printScreen(screen)
    {
        var count = 0;
        for(var y = 0; y < height; y++)
        {
            print('\r');
            for(var x = 0; x < width; x++)
            {
                var c = screen[y][x];
                if (c == '#')
                    count++;
                print(c);
            }
            print(consoleControl.nextLine(1));    
        }
        print(consoleControl.up(50));    
        return count;
    }

    function isCorner(x, y)
    {
        if (x == 0 && y == 0)
            return true;
        if (x == 0 && y == height-1)
            return true;
        if (x == width-1 && y == 0)
            return true;
        if (x == width-1 && y == height-1)
            return true;

        return false;        
    }

    function getState(screen, x, y)
    {
        if (x < 0 || x >= width || y < 0 || y >= height)
            return 0;

        if (isCorner(x, y))
            return 1;
            
        var c = screen[y][x];
        if (c == '#')
            return 1;
        else
            return 0;
    }

    function setState(screen, x, y, value)
    {
        if (x < 0 || x >= width || y < 0 || y >= height)
            return ;

        if (isCorner(x, y))
            value = 1;

        screen[y][x] = (value ? '#' : '.');
    }

    function getNeighborsOn(screen, x, y)
    {
        var c1 = getState(screen, x-1, y-1);
        var c2 = getState(screen, x  , y-1);
        var c3 = getState(screen, x+1, y-1);

        var c4 = getState(screen, x-1, y);
        var c5 = getState(screen, x+1, y);

        var c6 = getState(screen, x-1, y+1);
        var c7 = getState(screen, x  , y+1);
        var c8 = getState(screen, x+1, y+1);

        return c1+c2+c3+c4+c5+c6+c7+c8;
    }

    function animateLights()
    {
        var input = currentScreen;
        var output= (currentScreen == screen1) ? screen2 : screen1;

        for(var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                var state     = getState(input, x, y) ;
                var neighbors = getNeighborsOn(input, x, y);

                if (state) // on
                {
                    if (neighbors != 2 && neighbors != 3)
                        setState(output, x, y, 0);
                    else
                        setState(output, x, y, 1);
                }
                else
                {
                    if (neighbors != 3)
                        setState(output, x, y, 0);
                    else
                        setState(output, x, y, 1);
                }
            }
        }

        currentScreen = output;
    }

    function parseInput(line)
    {
        var row = line.split('');
        screen1.push(row);
        screen2.push([].concat(row));
    }
}
