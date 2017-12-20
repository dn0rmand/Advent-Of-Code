module.exports.create = function(pid, sndQueue, rcvQueue)
{
    const compiler = require('../tools/interpreter.js');

    let vm = new compiler();

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
            sndQueue.push(v);
            vm.didSend(v);
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
            if (rcvQueue.length > 0)
            {
                let v = rcvQueue.shift();
                vm.$registers[arg1] = v;
                vm.didReceive(v);
            }
            else
                return 0; // cause the program to stay on this location
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

    vm.didReceive = function(value) {
        // does nothing by default
    }

    vm.didSend = function(value) {
        // does nothing by default        
    }
    
    return vm;
};

module.exports.run = function(vms)
{
    let moved = true;
    while (moved)
    {
        moved = false;

        for(let i = 0; i < vms.length; i++)
        {
            let vm = vms[i];
            if (vm.stopped)
                continue;

            let step = vm.$current;
            vm.runStep();
            if (vm.$current !== step)
                moved = true;
            if (vm.$current >= vm.$instructions.length)
                vm.stopped = true;
        }
    }    
}