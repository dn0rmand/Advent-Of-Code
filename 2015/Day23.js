module.exports = function()
{
    const parser = require('../tools/parser.js');
    const assert = require('assert');
    const fs = require('fs');
    const readline = require('readline');
    const prettyHrtime = require('pretty-hrtime');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day23.data')
    });

    var input      = [];

    var $registers = {
        a:0,
        b:0
    };
    var $instructions = [];
    var $current ;
    var $multiplications = [];

    readInput
    .on('line', (line) => { 
        input.push(line);
    })
    .on('close', () => {
        var start = process.hrtime();

        compile();

        var end = process.hrtime(start);
        var words = prettyHrtime(end, {verbose:true});
        console.log("Compiled in " + words);

        $registers.a = 0;
        $registers.b = 0;
        var b0 = execute();
        console.log("A=0 , B=0 => " + b0);
        $registers.a = 1;
        $registers.b = 0;
        var b1 = execute();
        console.log("A=1 , B=0 => " + b1);
        process.exit(0);
    });

    const opcode = {
        hlf: 1,
        tpl: 2,
        inc: 3,
        jmp: 4,
        jie: 5,
        jio: 6,
    };

    const opcodeFunctions = 
    {
        inc: function(r) {
            var v = $registers[r];
            $registers[r] = v+1;
        },
        hlf: function(r) {
            var v = $registers[r];
            v = v / 2;
            $registers[r] = Math.floor(v);
        },
        tpl: function(r) {
            var v = $registers[r];
            $registers[r] = v + v + v;
        },
        jmp: function(offset) {
            return offset;
        },
        jie: function(r, offset) {
            r = $registers[r];
            if ((r & 1) == 0)
                return offset;
        },
        jio: function(r, offset) {
            r = $registers[r];
            if (r == 1)
                return offset;
        }
    };

    function execute()
    {
        start = process.hrtime();

        $current = 0;
        while ($current < $instructions.length)
        {
            process.stdout.write('\ra=' + $registers.a + ' , b=' + $registers.b + '          ');
            global.gc();
            var i = $instructions[$current];            
            var offset = i.fn(i.arg1, i.arg2);
            if (offset === undefined)
                $current++;
            else
                $current += offset;
        }
        console.log('');
        end = process.hrtime(start);
        words = prettyHrtime(end, {verbose:true});
        console.log("Executed in " +words);

        return $registers.b;
    }

    function compile()
    {
        function createArgument(value)
        {
            var v;

            if (typeof value == 'string')        
                return value;
            else if (value === undefined)
                throw "Invalid value"
            else
                return +value;                
        }

        for(var current = 0; current < input.length; current++)
        {
            var line  = input[current];
            var parse = new parser(line);
            var instruction = {
                code: 0,
                fn: undefined,
                arg1: undefined,
                arg2: undefined
            };

            var command = parse.getToken();

            instruction.code = opcode[command];
            if (instruction.code === undefined)
                throw "Invalid " + line;

            instruction.fn = opcodeFunctions[command];

            if (instruction.code == opcode.hlf || instruction.code == opcode.tpl || instruction.code == opcode.inc) 
            {
                instruction.arg1 = parse.getToken();
                assert(instruction.arg1 == 'a' || instruction.arg1 == 'b');
            }
            else if (instruction.code == opcode.jie || instruction.code == opcode.jio) 
            {
                instruction.arg1 = parse.getToken(); // Register
                assert(instruction.arg1 == 'a' || instruction.arg1 == 'b');
                parse.expectOperator(',')
                instruction.arg2 = parse.getSignedNumber();               
            }
            else if (instruction.code == opcode.jmp) 
            {
                instruction.arg1 = parse.getSignedNumber();
            }
            else
            {
                throw "Invalid syntax";
            }

            $instructions.push(instruction);
        }
    }
}