const VirtualMachine = require('advent_tools/assembly2020');

function part1()
{
    const vm = new VirtualMachine(__filename);
    const executed = [];

    while(! executed[vm.ip]) {
        executed[vm.ip] = 1;
        vm.step();
    }

    return vm.accumulator;
}

function part2()
{
    const vm = new VirtualMachine(__filename);

    targetIp = vm.instructions.length;

    function testProgram()
    {
        vm.reset();

        const executed = [];
        while(vm.ip !== targetIp) 
        {
            if (executed[vm.ip])
                return false;

            executed[vm.ip] = 1;
            vm.step();
        }

        return true;
    }

    // try to replace jmp with nop

    for(let i = vm.instructions.length-1; i >= 0 ; i--) 
    {
        const instruction = vm.instructions[i];
        const fct = instruction.execute;

        if (instruction.token === 'jmp') 
        {
            // Change to a nop and try
            instruction.execute = _ => 1;

            if (testProgram()) 
                return vm.accumulator;

            // restore
            instruction.execute = fct;
        } 
        else if (instruction.token === 'nop') 
        {
            // Change to a nop and try
            instruction.execute = _ => instruction.value;

            if (testProgram()) 
                return vm.accumulator;

            // restore
            instruction.execute = fct;
        }
    }
    
    throw "No solutions";
}

console.log('--- Advent of Code day 8 ---');
console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
