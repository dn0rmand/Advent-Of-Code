/*

cpy x y copies x (either an integer or the value of a register) into register y.
inc x increases the value of register x by one.
dec x decreases the value of register x by one.
jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.

*/

module.exports.create = function()
{
    const interpreter = require("../tools/interpreter.js");

    let vm = new interpreter();
    let opCode = {};

    opCode.inc = vm.add(
        'inc', 
        function(arg1) 
        {
            vm.$registers[arg1]++;
        },
        function(instruction, parser) 
        {
            instruction.arg1 = parser.getToken(); 
        }
    );

    opCode.dec = vm.add(
        'dec', 
        function(arg1) 
        {
            vm.$registers[arg1]--;
        },
        function(instruction, parser) 
        {
            instruction.arg1 = parser.getToken(); 
        }
    );

    opCode.cpy = vm.add(
        'cpy', 
        function(arg1, arg2) 
        {
            if (typeof(arg1) === "string")
                vm.$registers[arg2] = vm.$registers[arg1]
            else
                vm.$registers[arg2] = arg1;
        },
        function(instruction, parser) 
        {
            instruction.arg1 = vm.createArgument(parser.getValue());
            instruction.arg2 = parser.getToken();
        }        
    );

    opCode.jnz = vm.add(
        'jnz', 
        function(condition, offset) 
        {
            if (typeof(condition) === "string")
                condition = vm.$registers[condition];
            if (condition !== 0)
            {
                if (typeof(offset) === "string")
                    return vm.$registers[offset];
                else
                    return offset;
            }
        },
        function(instruction, parser) 
        {
            instruction.arg1 = vm.createArgument(parser.getValue());
            instruction.arg2 = vm.createArgument(parser.getValue());
        }
    );

    opCode.tgl = vm.add(
        'tgl',
        function(arg1) 
        {
            function updateInstruction(instruction, newCode, fix)
            {
                let i2 = vm.getInstruction(newCode);
                instruction.code = i2.code;
                instruction.fn   = i2.fn;
                if (fix === 1 && typeof(instruction.arg1) !== "string") // Invalid
                {
                    instruction.fn = function() {}
                }
                else if (fix === 2 && typeof(instruction.arg2) !== "string") // Invalid
                {
                    instruction.fn = function() {}
                }
            }

            if (typeof(arg1) === "string")
                arg1 = vm.$registers[arg1];
            let index = vm.$current + arg1;

            if (index < 0  || index >= vm.$instructions.length)
                return;

            let instruction = vm.$instructions[index];
            if (arg1 == 0)
            {
                updateInstruction(instruction, 'inc', 0);
                instruction.arg1 = 'a';
            }
            else 
            {
                switch (instruction.code)
                {
                    case opCode.inc:
                    {
                        updateInstruction(instruction, 'dec', 1);
                        break;
                    }
                    case opCode.dec:
                    case opCode.tgl:
                    {
                        updateInstruction(instruction, 'inc', 1);
                        break;
                    }
                    case opCode.cpy:
                    {
                        updateInstruction(instruction, 'jnz', 2);
                        break;
                    }
                    case opCode.jnz:
                    {
                        updateInstruction(instruction, 'cpy', 0);
                        break;
                    }
                }
            }
        },
        function(instruction, parser)
        {
            instruction.arg1 = vm.createArgument(parser.getValue());
        }
    )

    vm.doMultiplication = function(cpy)
    {
        if (cpy.code !== opCode.cpy)
            return 0;

        if (vm.$current+5 >= vm.$instructions.length)
            return 0;

        let jnz1 = vm.$instructions[vm.$current+3];

        if (jnz1.code !== opCode.jnz || jnz1.arg2 !== -2)
            return 0;
        
        let jnz2 = vm.$instructions[vm.$current+5];

        if (jnz2.code !== opCode.jnz || jnz2.arg2 !== -5)
            return 0;

        let dec2 = vm.$instructions[vm.$current+4];

        if (dec2.code !== opCode.dec)
            return 0;

        let inc  = vm.$instructions[vm.$current+1];
        let dec1 = vm.$instructions[vm.$current+2];

        if (dec1.code === opCode.inc && inc.code === opCode.dec)
        {
            let i = dec1;
            dec1 = inc;
            inc  = i;
        }

        if (inc.code !== opCode.inc || dec1.code !== opCode.dec ||
            dec1.arg1 === dec2.arg2 ||
            dec1.arg1 !== jnz1.arg1 || dec2.arg1 !== jnz2.arg1 ||
            cpy.arg2 !== jnz1.arg1 || cpy.arg2 === cpy.arg1 ||
            inc.arg1 === dec1.arg1 || inc.arg1 === dec2.arg)
            return 0;

        let v1  = cpy.arg1;
        let v2  = vm.$registers[dec2.arg1];

        if (typeof(v1) === "string")
            v1 = vm.$registers[v1];
        
        vm.$registers[inc.arg1] += (v1*v2);
        vm.$registers[dec1.arg1] = 0;
        vm.$registers[dec2.arg1] = 0;

        return 6; // skip 6 instructions
    }

    return vm;
}
