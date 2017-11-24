/*

cpy x y copies x (either an integer or the value of a register) into register y.
inc x increases the value of register x by one.
dec x decreases the value of register x by one.
jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.

*/

module.exports = async function()
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

    await vm.parse("Data/Day12.data");

    vm.compile();

    vm.$registers.c = 1;
    vm.execute();
 
    console.log("A = " + vm.$registers.a);
}
