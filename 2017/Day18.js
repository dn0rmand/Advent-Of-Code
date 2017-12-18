module.exports = async function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const compiler = require('../tools/interpreter.js');

    let queue = [ [] , [] ];

    async function createVM(pid, part1)
    {
        let vm = new compiler();
        vm.sent = 0;
        
        queue[pid] = []; // reset for part 2

        function convert(arg1)
        {
            if (typeof(arg1) === "string")
                return vm.$registers[arg1];
            else 
                return arg1;
        }

        vm.add(
            'snd',
            arg1 => {
                let v = convert(arg1);
                queue[pid].push(v);
                vm.sent++;
            },
            (instruction, parser) => {
                instruction.arg1 = vm.createArgument(parser.getValue());
            }
        );
        
        vm.add(
            'set',
            (arg1, arg2) => {
                vm.$registers[arg1] = convert(arg2);
            },
            (instruction, parser) => {
                instruction.arg1 = parser.getToken();
                instruction.arg2 = vm.createArgument(parser.getValue());
            }
        );
        
        vm.add(
            'add',
            (arg1, arg2) => {
                vm.$registers[arg1] += convert(arg2);
            },
            (instruction, parser) => {
                instruction.arg1 = parser.getToken();
                instruction.arg2 = vm.createArgument(parser.getValue());
            }
        );
        
        vm.add(
            'mul',
            (arg1, arg2) => {
                vm.$registers[arg1] *= convert(arg2);
            },
            (instruction, parser) => {
                instruction.arg1 = parser.getToken();
                instruction.arg2 = vm.createArgument(parser.getValue());
            }
        );
        
        vm.add(
            'mod',
            (arg1, arg2) => {
                vm.$registers[arg1] = vm.$registers[arg1] % convert(arg2);
            },
            (instruction, parser) => {
                instruction.arg1 = parser.getToken();
                instruction.arg2 = vm.createArgument(parser.getValue());
            }
        );
        
        vm.add(
            'rcv',
            (arg1) => {
                if (part1 === true) {
                    console.log("Part 1: Last sound is " + queue[pid].pop());
                    return 1000; // move out to stop program
                }
                else
                {
                    var q = queue[(pid+1) % 2]; // other program's queue
                    if (q.length > 0)
                    {
                        vm.$registers[arg1] = q.shift();
                    }
                    else
                        return 0; // cause the program to stay on this location
                }
            },
            (instruction, parser) => {
                instruction.arg1 = parser.getToken();
            }
        );
        
        vm.add(
            'jgz',
            (arg1, arg2) => {
                if (convert(arg1) > 0)
                {
                    return convert(arg2);
                }
            },
            (instruction, parser) => {
                instruction.arg1 = vm.createArgument(parser.getValue());
                instruction.arg2 = vm.createArgument(parser.getValue());
            }
        );

        await vm.parse("Data/Day18.data");

        vm.compile();
        vm.$registers.p = pid;
        return vm;
    }

    async function solve1()
    {
        let vm = await createVM(0, true);

        vm.execute();
    }    

    async function solve2()
    {
        function isStopped(vm)
        {
            if (vm.$current >= vm.$instructions.length)
                return true;
        }

        let vm0 = await createVM(0);
        let vm1 = await createVM(1);

        while (true)
        {
            let step0 = vm0.$current;
            let step1 = vm1.$current;

            vm0.runStep();
            vm1.runStep();

            if (isStopped(vm0) || isStopped(vm1))
                break;
            if (step0 === vm0.$current && step1 === vm1.$current) // dead lock
                break;
        }
        
        console.log("Program 0 sent " + vm0.sent + " times ");
        console.log("Program 1 sent " + vm1.sent + " times ");
    }

    await solve1();
    await solve2();

    process.exit(0);
}