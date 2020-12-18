module.exports = function()
{
    const { VirtualMachine, Instruction } = require('advent_tools/assembly2020');
    const readFile = require('advent_tools/readfile');

    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    function part1(fileContent)
    {
        const vm = new VirtualMachine(fileContent);

        for(let inst = vm.instructions[vm.ip]; ! inst.visited; inst = vm.instructions[vm.ip])
        {
            inst.visited = 1;
            vm.step();
        }

        return vm.accumulator;
    }

    function part2(fileContent)
    {
        const vm = new VirtualMachine(fileContent);

        targetIp = vm.instructions.length;

        function testProgram(context)
        {
            vm.ip = context.ip;
            vm.accumulator = context.accumulator;

            while(vm.ip !== targetIp)
            {
                if (vm.ip < 0 || vm.ip > targetIp)
                    return false;

                if (vm.instructions[vm.ip].visited)
                    return false;

                vm.step();
            }

            return true;
        }

        // Find looping point

        const tracks = [];

        // Find looping point
        for(let instruction = vm.instructions[vm.ip]; !instruction.visited; instruction = vm.instructions[vm.ip])
        {
            if (instruction.token !== 'acc')
            {
                tracks.push({ ip: vm.ip, accumulator: vm.accumulator });
            }
            instruction.visited = 1;
            vm.step();
        }

        // go backward

        const nop = Instruction.create("nop", 0);
        const jmp = Instruction.create("jmp", 0);

        while (tracks.length > 0)
        {
            const track = tracks.pop();
            const old = vm.instructions[track.ip];

            try
            {
                if (old.token === 'jmp')
                {
                    vm.instructions[track.ip] = nop;
                }
                else
                {
                    jmp.value = old.value;
                    vm.instructions[track.ip] = jmp;
                }

                if (testProgram(track))
                {
                    return vm.accumulator;
                }
            }
            finally
            {
                // restore instruction
                vm.instructions[track.ip] = old;
            }
        }

        throw "No solutions";
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    const fileContent = [...readFile(__filename)];

    console.time(`${DAY}-both`);

    console.log(`Part 1: ${part1(fileContent)}`);
    console.log(`Part 2: ${part2(fileContent)}`);

    console.timeLog(`${DAY}-both`, `to execute both parts of day ${DAY}`);
};