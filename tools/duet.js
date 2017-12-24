module.exports.create = function(pid, sndQueue, rcvQueue)
{
    const compiler = require('../tools/interpreter.js');

    let vm = new compiler();

    function isNumber(n) 
    { 
        return typeof(n) === "number"; 
    }

    function convert(arg1)
    {
        if (typeof(arg1) === "string")
            return vm.$registers[arg1] || 0;
        else 
            return arg1;
    }

    let opCode = {};
    
    opCode.nop = vm.add(
        'nop',
        (arg1, arg2) => {},
        (instruction, parser) => {},
        (arg1, arg2) => { return ''; } // does nothing
    );

    opCode.snd = vm.add(
        'snd',
        arg1 => {
            let v = convert(arg1);
            sndQueue.push(v);
            vm.didSend(v);
        },
        (instruction, parser) => {
            instruction.arg1 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2) => {
            return 'throw "not supported"';
        }
    );
    
    opCode.set = vm.add(
        'set',
        (arg1, arg2) => {
            vm.$registers[arg1] = convert(arg2);
        },
        (instruction, parser) => {
            instruction.arg1 = parser.getToken();
            instruction.arg2 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2) => {
            return arg1 + '=' + arg2;
        }
    );
    
    opCode.add = vm.add(
        'add',
        (arg1, arg2) => {
            vm.$registers[arg1] = convert(arg1) + convert(arg2);
        },
        (instruction, parser) => {
            instruction.arg1 = parser.getToken();
            instruction.arg2 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2) => {
            if (arg2 === 0)
                return '';
            else if (arg2 === -1)
                return arg1 + '--';
            else if (arg2 === 1)
                return arg1 + '++';
            else if (isNumber(arg2) && arg2 < 0)
                return arg1 + '-=' + (-arg2);
            else
                return arg1 + '+=' + arg2;
        }
    );
    
    opCode.sub = vm.add(
        'sub',
        (arg1, arg2) => {
            vm.$registers[arg1] = convert(arg1) - convert(arg2);
        },
        (instruction, parser) => {
            instruction.arg1 = parser.getToken();
            instruction.arg2 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2) => {
            if (arg2 === 0)
                return '';
            else if (arg2 === 1)
                return arg1 + '--';
            else if (arg2 === -1)
                return arg1 + '++';
            else if (isNumber(arg2) && arg2 < 0)
                return arg1 + '+=' + (-arg2);
            else
                return arg1 + '-=' + arg2;
        }
    );

    opCode.mul = vm.add(
        'mul',
        (arg1, arg2) => {
            vm.$registers[arg1] = convert(arg1) * convert(arg2);
        },
        (instruction, parser) => {
            instruction.arg1 = parser.getToken();
            instruction.arg2 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2) => {
            return arg1 + '*=' + arg2;
        }
    );
    
    opCode.mod = vm.add(
        'mod',
        (arg1, arg2) => {
            vm.$registers[arg1] = convert(arg1) % convert(arg2);
        },
        (instruction, parser) => {
            instruction.arg1 = parser.getToken();
            instruction.arg2 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2) => {
            return arg1 + '%=' + arg2;
        }
    );
    
    opCode.rcv = vm.add(
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
        },
        (arg1, arg2) => {
            return 'throw "not supported"';
        }
    );
    
    opCode.jnz = vm.add(
        'jnz',
        (arg1, arg2) => {
            if (convert(arg1) != 0)
            {
                return convert(arg2);
            }
        },
        (instruction, parser) => {
            instruction.arg1 = vm.createArgument(parser.getValue());
            instruction.arg2 = vm.createArgument(parser.getValue());
        },
        (arg1, arg2, pos) => {
            if (isNumber(arg1))
            {
                if (arg1 !== 0)
                    return $goto(pos, arg2);
                else
                    return '';
            }
            else if (arg2 === 2)
            {
                return 'if ('+arg1+'==0) {';
            }
            else
                return 'if (' + arg1 + '!=0) {' + $goto(pos, arg2) + '}';
        }
    );

    opCode.jgz = vm.add(
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
        },
        (arg1, arg2, pos) => {
            if (isNumber(arg1))
            {
                if (arg1 > 0)
                    return $goto(pos, arg2);
                else
                    return '';
            }
            else
                return 'if (' + arg1 + '>0) {' + $goto(pos, arg2) + '}';
        }
    );

    function $goto(pos, arg2)
    {
        if (typeof(arg2) === "string")
            throw "arg2 cannot be a register";

        let label = pos + arg2;
        if (label >= vm.$instructions.length)
            label = 'case_state=-1; continue;';
        else
            label = 'case_state=' + label + '; continue';  
        return label;          
    }

    vm.didReceive = function(value) {
        // does nothing by default
    }

    vm.didSend = function(value) {
        // does nothing by default        
    }
    
    vm.opCodes = opCode;

    vm.compileToJavascript = function(name, registerToReturn)
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