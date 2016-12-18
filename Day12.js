module.exports = function()
{
    const parser = require('./parser.js');
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day12.data')
    });

    var input = [];

    readInput
    .on('line', (line) => { 
        input.push(line);
    })
    .on('close', () => {
        var result = execute();
        console.log("A = " + result);
        process.exit(0);
    });

    function execute()
    {
        function getVariable(parse)
        {
            var value = parse.getValue();

            if (typeof value == 'string')        
            {
                return registers[value] || 0;
            }
            else if (value === undefined)
                throw "Invalid value"
            else
                return value;
        }

        var current = 0;
        var registers = { c:1 };
        var step = 0;

        while(current < input.length)
        {
            line  = input[current++];

            var parse = new parser(line);
            //console.log(step++ + " : " + line);
            
            var command = parse.getToken();
            if (command == 'cpy') 
            {
                var v = getVariable(parse);
                var r = parse.getToken();
                registers[r] = v;
            }
            else if (command == 'inc')
            {
                var register = parse.getToken();
                registers[register] = (registers[register] || 0) + 1;
            }
            else if (command == 'dec')
            {
                var register = parse.getToken();
                registers[register] = (registers[register] || 0) - 1;
            }
            else if (command == 'jnz')
            {
                var condition = getVariable(parse);
                if (condition != 0)
                {
                    var offset   = parse.getSignedNumber();
                    current = (current-1)+offset;
                }
            }
        }

        return registers.a || 0;
    }

    /*

    cpy x y copies x (either an integer or the value of a register) into register y.
    inc x increases the value of register x by one.
    dec x decreases the value of register x by one.
    jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.

    */
}