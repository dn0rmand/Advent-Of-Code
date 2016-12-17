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

readInput
.on('line', (line) => { 
    processLine(line);
})
.on('close', () => {
    console.log("Done ...");
    var pixels = 0;
    for(var y = 0; y < 6; y++)
    {
        var l = "";
        for(var x = 0; x < 50; x++)
        {
            if (screen[y][x])
            {
                pixels++;
                l += '#';
            }
            else
                l += ' '
        }
        console.log(l);            
    }
    console.log(pixels + " pixels");
    process.exit(0);
});

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
