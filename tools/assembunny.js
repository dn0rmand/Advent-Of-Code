/*

cpy x y copies x (either an integer or the value of a register) into register y.
inc x increases the value of register x by one.
dec x decreases the value of register x by one.
jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.

*/

module.exports.create = function()
{
    const interpreter = require("../tools/interpreter.js");

    var vm = new interpreter();

    vm.add(
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

    vm.add(
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

    vm.add(
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

    vm.add(
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

    vm.add(
        'tgl',
        function(arg1) 
        {
            function updateInstruction(instruction, newCode, fix)
            {
                var i2 = vm.getInstruction(newCode);
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
            var index = vm.$current + arg1;

            if (index < 0  || index >= vm.$instructions.length)
                return;

            var instruction = vm.$instructions[index];
            if (arg1 == 0)
            {
                updateInstruction(instruction, 'inc', 0);
                instruction.arg1 = 'a';
            }
            else 
            {
                switch (instruction.code)
                {
                    case vm.getOpcode('inc'):
                    {
                        updateInstruction(instruction, 'dec', 1);
                        break;
                    }
                    case vm.getOpcode('dec'):
                    case vm.getOpcode('tgl'):
                    {
                        updateInstruction(instruction, 'inc', 1);
                        break;
                    }
                    case vm.getOpcode('cpy'):
                    {
                        updateInstruction(instruction, 'jnz', 2);
                        break;
                    }
                    case vm.getOpcode('jnz'):
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
    return vm;
}
