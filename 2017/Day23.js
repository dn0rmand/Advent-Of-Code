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

    function asJS(vm, name, registerToReturn)
    {
        let compiled = 'function ' + name + '() {';
 
        let first = true;
        Object.keys(vm.$registers).forEach(k => 
        {
            if (first)
            {
                first = false;
                compiled += 'let ';
            }
            else
                compiled += ', ';

            compiled += k + '=' + vm.$registers[k];
        });
        compiled += ';';

        let lines = [];

        // Find required labels

        for(let p = 0; p < vm.$instructions.length; p++)
        {
            let i = vm.$instructions[p];
            let ins = i.asJS(i.arg1, i.arg2, p);
            let s = ins.split('case_state=');
            if (s.length == 2)
            {
                let label = +(s[1].split(';')[0]);
                lines[label] = 1;
            }
        };
        
        lines[0] = 1;

        // Generate instructions

        compiled += 'let case_state=0;' +
                    'while(case_state!=-1) {'+
                    'switch(case_state) {';
        
        let convertedIf = false;
        let bracket = 0;

        for(let p = 0; p < vm.$instructions.length; p++)
        {
            let i = vm.$instructions[p];
            if (lines[p] !== undefined)
                compiled += 'case '+p+":";
            let js = i.asJS(i.arg1, i.arg2, p);

            if (js === undefined || js === '')
                continue;

            convertedIf = js.endsWith('{');
            if (convertedIf)
                bracket++;
            else if (registerToReturn === 'm' && i.code == vm.opCodes.mul)
                js += '; m++;/* counting mul usage */';
            else if (! js.endsWith('}'))
                js += ';'

            compiled += js;
            if (! convertedIf && bracket > 0)
            {
                let close = '';
                while (bracket > 0)
                {
                    close += '}';
                    bracket--;
                }
                compiled += close;
            }
        };

        compiled += 'case -1: case_state=-1; break;}}';

        if (registerToReturn !== undefined) 
            compiled += 'return '+registerToReturn+';';
        compiled += '}';
        return compiled;
    }

    function solve1(vm, compiled)
    {
        let mulCount = 0;

        if (compiled)
        {
            let part1Function = asJS(vm, '__PART1__', 'm');
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

            // vm.optimize = function(i)
            // {
            //     function check(p, code, arg1, arg2)
            //     {
            //         let i = vm.$instructions[p];
            //         return (i.code === code && i.arg1 === arg1 && i.arg2 === arg2);
            //     }

            //     let p = vm.$current;
            //     if (check(p, vm.opCodes.jnz, 'g', -13)) // Shortcut the loop if f is 0
            //     {
            //         if (vm.$registers.f === 0)
            //             return 1;
            //     }
            //     else
            //     {
            //         // Convert a set of instructions to a single modulo and if it's 0, set f to 0

            //         if (check(p++, vm.opCodes.set, 'e', 2))
            //         if (check(p++, vm.opCodes.set, 'g', 'd'))
            //         if (check(p++, vm.opCodes.mul, 'g', 'e'))
            //         if (check(p++, vm.opCodes.sub, 'g', 'b'))
            //         if (check(p++, vm.opCodes.jnz, 'g', 2))
            //         if (check(p++, vm.opCodes.set, 'f', 0))
            //         if (check(p++, vm.opCodes.sub, 'e', -1))
            //         if (check(p++, vm.opCodes.set, 'g', 'e'))
            //         if (check(p++, vm.opCodes.sub, 'g', 'b'))
            //         if (check(p++, vm.opCodes.jnz, 'g', -8))
            //         {
            //             vm.$registers.f = (vm.$registers.b % vm.$registers.d);
            //             return p - vm.$current;
            //         }
            //     }
            // }

            vm.execute(false);
            nonPrime = vm.$registers.h;
        }
        else
        {
            let part2Function = asJS(vm, '__PART2__', 'h');
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