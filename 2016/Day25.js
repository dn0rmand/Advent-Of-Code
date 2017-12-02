module.exports = function()
{
    const parser = require('../tools/parser.js');
    const fs = require('fs');
    const readline = require('readline');
    const prettyHrtime = require('pretty-hrtime');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day25.data')
    });

    var input      = [];

    var $registers = {};
    var $instructions = [];
    var $current ;
    var $multiplications = [];
    var $expect = 0;
    var $count = 1000;
    var $inputA = 0;

    readInput
    .on('line', (line) => { 
        input.push(line);
    })
    .on('close', () => {
        var a = execute();
        console.log("A = " + a);
        process.exit(0);
    });

    const opcode = {
        inc: 1,
        dec: 2,
        cpy: 3,
        jnz: 4,
        tgl: 5,
        out: 6
    };

    function reset(aValue)
    {
        // Reset all
        Object.keys($registers).forEach( (r) => { $registers[r] = 0; });
        $registers['a'] = aValue;
        $expect = 0;
        $count  = 1000;
    }

    const opcodeFunctions = 
    {
        out: function(arg1) {
            if (typeof(arg1) === "string")
                arg1 = $registers[arg1];
            if (arg1 === $expect)
            {
                $expect = ($expect === 0 ? 1 : 0);
                $count--;
                if ($count === 0)
                    return $instructions.length;
            }
            else
            {
                reset(++$inputA);
                return -$current; // Move back to first instruction
            }
        },
        inc: function(arg1) {
            $registers[arg1]++;
        },
        dec: function(arg1) {
            $registers[arg1]--;
        },
        cpy: function(arg1, arg2) {
            if (typeof(arg1) === "string")
                $registers[arg2] = $registers[arg1]
            else
                $registers[arg2] = arg1;
        },
        jnz: function(condition, offset) {
            if (typeof(condition) === "string")
                condition = $registers[condition];
            if (condition !== 0)
            {
                if (typeof(offset) === "string")
                    return $registers[offset];
                else
                    return offset;
            }
        },
        tgl: function(arg1) {
            if (typeof(arg1) === "string")
                arg1 = $registers[arg1];
            var index = $current + arg1;

            if (index < 0  || index >= $instructions.length)
                return;

            var instruction = $instructions[index];
            if (arg1 == 0)
            {
                instruction.code   = opcode.inc;
                instruction.fn     = opcodeFunctions.inc;
                instruction.arg1   = 'a';
            }
            else 
            {
                $multiplications = [];
                switch (instruction.code)
                {
                    case opcode.inc:
                        instruction.code = opcode.dec;
                        instruction.fn   = opcodeFunctions.dec;
                        if (typeof(instruction.arg1) !== "string") // Invalid
                            instruction.fn = function() {}
                        break;
                    case opcode.dec:
                    case opcode.tgl:
                        instruction.code = opcode.inc;
                        instruction.fn   = opcodeFunctions.inc;
                        if (typeof(instruction.arg1) !== "string") // Invalid
                            instruction.fn = function() {}
                        break;
                    case opcode.cpy:
                        instruction.code = opcode.jnz;
                        instruction.fn   = opcodeFunctions.jnz;
                        if (typeof(instruction.arg2) !== "string") // Invalid
                            instruction.fn = function() {}
                        break;
                    case opcode.jnz:
                        instruction.code = opcode.cpy;
                        instruction.fn   = opcodeFunctions.cpy;
                        break;
                }
            }
        }
    };

    function doMultiplication(cpy)
    {
        if ($current+5 >= $instructions.length)
            return false;

        var jnz1 = $instructions[$current+3];

        if (jnz1.code !== opcode.jnz || jnz1.arg2 !== -2)
            return false;
        
        var jnz2 = $instructions[$current+5];

        if (jnz2.code !== opcode.jnz || jnz2.arg2 !== -5)
            return false;

        var dec2 = $instructions[$current+4];

        if (dec2.code !== opcode.dec)
            return false;

        var inc  = $instructions[$current+1];
        var dec1 = $instructions[$current+2];

        if (dec1.code === opcode.inc && inc.code === opcode.dec)
        {
            var i = dec1;
            dec1 = inc;
            inc  = i;
        }

        if (inc.code !== opcode.inc || dec1.code !== opcode.dec ||
            dec1.arg1 === dec2.arg2 ||
            dec1.arg1 !== jnz1.arg1 || dec2.arg1 !== jnz2.arg1 ||
            cpy.arg2 !== jnz1.arg1 || cpy.arg2 === cpy.arg1 ||
            inc.arg1 === dec1.arg1 || inc.arg1 === dec2.arg)
            return false;

        var v1  = cpy.arg1;
        var v2  = $registers[dec2.arg1];

        if (typeof(v1) === "string")
            v1 = $registers[v1];
        
        $registers[inc.arg1] += (v1*v2);
        $registers[dec1.arg1] = 0;
        $registers[dec2.arg1] = 0;

        return true;
    }

    function execute()
    {
        var start = process.hrtime();

        compile();

        var end = process.hrtime(start);
        var words = prettyHrtime(end, {verbose:true});
        console.log("Compiled in " + words);

        start = process.hrtime();

        $inputA  = 0;
        reset(0);

        $current = 0;
        while ($current < $instructions.length)
        {
            var i = $instructions[$current];
            if (i.code == opcode.cpy)
            {
                if (doMultiplication(i)) {
                    $current += 6;
                    continue;
                }
            }

            var offset = i.fn(i.arg1, i.arg2);
            if (offset === undefined)
                $current++;
            else
                $current += offset;
        }

        end = process.hrtime(start);
        words = prettyHrtime(end, {verbose:true});
        console.log("Executed in " +words);

        return $inputA;
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

            if (instruction.code == opcode.cpy) 
            {
                instruction.arg1 = createArgument(parse.getValue());
                instruction.arg2 = parse.getToken();
            }
            else if (instruction.code == opcode.inc || instruction.code == opcode.dec) 
            {
                instruction.arg1 = parse.getToken();                
            }
            else if (instruction.code == opcode.jnz) 
            {
                instruction.arg1 = createArgument(parse.getValue());
                instruction.arg2 = createArgument(parse.getValue());
            }
            else if (instruction.code == opcode.tgl)
            {
                instruction.arg1 = createArgument(parse.getValue());
            } 
            else if (instruction.code === opcode.out)
            {
                instruction.arg1 = createArgument(parse.getValue());
            }

            // Pre-define registers
            if (instruction.arg1 !== undefined && typeof(instruction.arg1) === "string")
                $registers[instruction.arg1.value] = 0;
            if (instruction.arg2 !== undefined && typeof(instruction.arg1) === "string")
                $registers[instruction.arg2.value] = 0;

            $instructions.push(instruction);
        }
    }
}