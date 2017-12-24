const day23 = module.exports = async function()
{
    const compiler = require('../tools/duet.js');

    async function create(pid, sndQueue, rcvQueue)
    {
        let vm = compiler.create(pid, sndQueue, rcvQueue);

        await vm.parse("Data/Day23.data");

        vm.compile(true);
        vm.$registers.p = pid;
        vm.$registers.m = 0; // To count the calls to mul
        return vm;
    }

    async function initialize()
    {
        let queue = [];
        return await create(0, queue, queue);
    }  

    function optimize(vm)
    {
        function check(p, code, arg1, arg2)
        {
            if (p >= vm.$instructions.length)
                return false;
            let i = vm.$instructions[p];
            return (i.code === code && i.arg1 === arg1 && i.arg2 === arg2);
        }

        function convertTo(i, code)
        {
            let i2 = vm.getInstruction(code);
            i.code = i2.code;
            i.fn = i2.fn;
            i.asJS = i2.asJS;
        }

        for(let c = 0; c < vm.$instructions.length; c++)
        {
            // Convert a set of instructions to a single modulo and if it's 0, set f to 0

            let p = c;

            if (check(p++, vm.opCodes.set, 'e', 2))
            if (check(p++, vm.opCodes.set, 'g', 'd'))
            if (check(p++, vm.opCodes.mul, 'g', 'e'))
            if (check(p++, vm.opCodes.sub, 'g', 'b'))
            if (check(p++, vm.opCodes.jnz, 'g', 2))
            if (check(p++, vm.opCodes.set, 'f', 0))
            if (check(p++, vm.opCodes.sub, 'e', -1))
            if (check(p++, vm.opCodes.set, 'g', 'e'))
            if (check(p++, vm.opCodes.sub, 'g', 'b'))
            if (check(p++, vm.opCodes.jnz, 'g', -8))
            {
                let i = vm.$instructions[c++];

                convertTo(i, 'set');
                i.arg1 = 'g';
                i.arg2 = 'b';

                i = vm.$instructions[c++];

                convertTo(i, 'mod');
                i.arg1 = 'g';
                i.arg2 = 'd';

                i = vm.$instructions[c++];

                convertTo(i, 'jnz');
                i.arg1 = 'g';
                i.arg2 = 2;

                i = vm.$instructions[c++];
                
                convertTo(i, 'set');
                i.arg1 = 'f';
                i.arg2 = 0;

                // insert nop instruction to avoid breaking the jumps

                while (c < p)
                {
                    i = vm.$instructions[c++];

                    convertTo(i, 'nop');
                    i.arg1 = i.arg2 = undefined;                      
                }
                c--;
            }            
        }
    }

    function solve1(vm, compiled)
    {
        let mulCount = 0;

        if (compiled)
        {
            let part1Function = vm.compileToJavascript('__PART1__', 'm');
            eval(part1Function);
    
            mulCount = __PART1__();
        }
        else
        {        

            vm.optimize = function(instruction)
            {
                if (instruction.code === vm.opCodes.mul)
                    mulCount++;
            }

            vm.execute(false);
        }

        console.log('Part 1: ' + mulCount + ' multiplications (8281)');
    }  
    
    function solve2(vm, compiled)
    {  
        let nonPrime = 0;

        // A should be 1
        vm.$registers.a = 1;
        // Optimize code 
        optimize(vm);

        if (! compiled)
        {
            // Reset all registers
            Object.keys(vm.$registers).forEach(k => { vm.$registers[k] = 0; });
            // A should be 1
            vm.$registers.a = 1;

            vm.optimize = function(i) {}
            vm.execute(false);
            nonPrime = vm.$registers.h;
        }
        else
        {
            let part2Function = vm.compileToJavascript('__PART2__', 'h');
            eval(part2Function);    
            nonPrime = __PART2__();                
        }
        
        console.log('Part 2: ' + nonPrime + ' non-prime values (911)');
    }

    let vm = await initialize();
    let compileToJS = true;
    solve1(vm, compileToJS);
    solve2(vm, compileToJS);
    
    process.exit(0);
};

//day23(); // for debugging