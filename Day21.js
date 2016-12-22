module.exports = function()
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const parser    = require('./parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day21.data')
    });

    var input; 
    var commands = [];

    readInput
    .on('line', (line) => { 
        commands.push(line.toLowerCase());
    })
    .on('close', () => {
        input = 'abcdefgh'.split('');
        for(var i = 0; i < commands.length; i++)
            parseInput(commands[i]);

        console.log('Answer for part 1 is ' + input.join(''));

        input = 'fbgdceah'.split('');

        for(var i = commands.length; i > 0; i--)
            parseInput(commands[i-1], true);

        console.log('Answer for part 2 is ' + input.join(''));

        process.exit(0);
    });

    function parseInput(line, decrypt)
    {
        function rotate(direction, steps)
        {
            if (decrypt === true) 
                direction *= -1;

            var chars = [];

            for(var i = 0; i < input.length; i++)
            {
                var destin = i + (steps * direction);
                if (destin < 0)
                    destin += input.length;

                chars[destin % input.length] = input[i];
            }
            input = chars;
        }

        var parse = new parser(line);
        var command = parse.getToken();

        switch (command)
        {
            case 'swap':
            {
                var type = parse.getToken();
                if (type == 'letter')
                {
                    // swap letter b with letter g
                    var c1 = parse.getToken();
                    parse.expectToken('with');
                    parse.expectToken('letter');
                    var c2 = parse.getToken();
                    for(var i = 0; i < input.length; i++)
                    {
                        if (input[i] == c1)
                            input[i] = c2;
                        else if (input[i] == c2)
                            input[i] = c1;
                    }
                }
                else if (type == 'position')
                {
                    // swap position 1 with position 3

                    var p1 = parse.getNumber();
                    parse.expectToken('with');
                    parse.expectToken('position');
                    var p2 = parse.getNumber();
                    var c = input[p1];
                    input[p1] = input[p2];
                    input[p2] = c;
                }
                else
                    throw "invalid command " + line;
                break;
            }
            case 'reverse':
            {
                // reverse positions 1 through 4
                parse.expectToken('positions');
                var from = parse.getNumber();
                parse.expectToken('through');
                var to = parse.getNumber();
                var chars = [];
                for(var i = from; i<=to; i++)
                    chars[i-from] = input[i];
                chars.reverse();
                for(var i = from; i<=to; i++)
                    input[i] = chars[i-from];
                
                break;
            }
            case 'rotate':
            {
                // rotate right 7 steps
                // rotate based on position of letter f
                var sub = parse.getToken();
                if (sub == 'right' || sub == 'left')
                {
                    var steps = parse.getNumber();
                    rotate(sub == 'right' ? 1 : -1, steps);
                }
                else if (sub == 'based')
                {
                    parse.expectToken('on');
                    parse.expectToken('position');
                    parse.expectToken('of');
                    parse.expectToken('letter');
                    var letter = parse.getToken();
                    var index = input.indexOf(letter);
                    var steps = 1 + index + ( index >= 4 ? 1 : 0);

                    if (decrypt === true)
                    {
                        switch (index)
                        {
                            case 0:
                                steps = 9; 
                                break;
                            case 1:
                                steps = 1; 
                                break;
                            case 2:
                                steps = 6; 
                                break;
                            case 3:
                                steps = 2; 
                                break;
                            case 4:
                                steps = 7; 
                                break;
                            case 5:
                                steps = 3; 
                                break;
                            case 6:
                                steps = 8; 
                                break;
                            case 7:
                                steps = 4; 
                                break;
                            default:
                                throw "Not implemented";
                        }
                    }
                    rotate(1, steps)
                }
                else
                    throw "invalid command " + line;
                break;
            }
            case 'move':
            {
                // move position 7 to position 2
                parse.expectToken('position');
                var from = parse.getNumber();
                parse.expectToken('to');
                parse.expectToken('position');
                var to = parse.getNumber();

                if (decrypt === true)
                {
                    var x = to;
                    to = from;
                    from = x;
                }

                var char = input[from];
                input.splice(from, 1);
                input.splice(to, 0, char);
                break;
            }
            default:
                throw "Invalid command: " + line;
        }
    }
}
