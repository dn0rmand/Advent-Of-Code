module.exports = function()
{
    const sleep = require("sleep");
    const consoleControl = require('console-control-strings')    
    const parser = require('./parser.js');
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day08.data')
    });

    var screen = []

    for(var y = 0; y < 6 ; y++)
    {
        screen[y] = [];
        for (var x = 0; x < 50; x++)
            screen[y][x] = 0;
    }

    process.stdout.write(consoleControl.hideCursor());

    readInput
    .on('line', (line) => { 
        processLine(line);
        DrawScreen();
    })
    .on('close', () => {
        var pixels = DrawScreen(true, 'brightRed');
        console.log("Done ...");
        console.log(pixels + " pixels");
        process.stdout.write(consoleControl.showCursor());
        process.exit(0);
    });

    function wait()
    {
        sleep.usleep(50000);
        // var start = process.hrtime();
        // var end = process.hrtime(start);

        // while(end[1] < 30000000)
        //     end = process.hrtime(start);
    }

    function DrawScreen(final, color)
    {
        if (color === undefined)
            color = "brightWhite";

        process.stdout.write(consoleControl.color(color));
        process.stdout.write(consoleControl.color('bgBlack'));

        var pixels = 0;
        for(var x = 0; x < 52; x++)
            process.stdout.write(' ');        

        process.stdout.write(consoleControl.nextLine(1));                

        for(var y = 0; y < 6; y++)
        {
            process.stdout.write(' ');
            for(var x = 0; x < 50; x++)
            {
                if (screen[y][x])
                {
                    pixels++;
                    process.stdout.write('#');
                }
                else
                    process.stdout.write(' ');
            }
            process.stdout.write(' ');
            process.stdout.write(consoleControl.nextLine(1));    
        }    

        for(var x = 0; x < 52; x++)
            process.stdout.write(' ');        

        process.stdout.write(consoleControl.nextLine(1));                
        process.stdout.write(consoleControl.color('reset'));

        if (final !== true) {
            process.stdout.write('\x1b[8A');
            wait();
        }
        return pixels;
    }

    function processLine(line)
    {
        var parse = new parser(line);
        
        var token = parse.getToken();

        if (token == 'rect')
        {
            var xx = parse.getNumber();
            parse.expectToken('x');
            var yy = parse.getNumber();

            for (var y = 0 ; y < yy ; y++)
            for (var x = 0 ; x < xx ; x++)
                screen[y][x] = 1;
        }
        else if (token == 'rotate')
        {
            token = parse.getToken();
            if (token == 'row')
            {
                parse.expectToken('y');

                var op = parse.getOperator();
                if (op != '=')
                    throw "= operator expected";

                var yy = parse.getNumber();
                parse.expectToken('by');
                var by = parse.getNumber(); 
                var newrow = [];
                for(var x = 0; x < 50; x++)
                    newrow[(x + by) % 50] = screen[yy][x];
                screen[yy] = newrow;
            }
            else if (token == 'column')
            {
                parse.expectToken('x');
                var op = parse.getOperator();
                if (op != '=')
                    throw "= operator expected";

                var xx = parse.getNumber();
                parse.expectToken('by');
                var by = parse.getNumber(); 
                var newcol = [];

                for(var y = 0; y < 6; y++)
                    newcol[y] = screen[y][xx];

                for(var y = 0; y < 6; y++)
                    screen[(y + by) % 6][xx] = newcol[y];

                screen[yy] = newrow;
            }
        }
    }
}