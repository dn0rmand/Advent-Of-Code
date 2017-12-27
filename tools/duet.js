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

    let closeBracketAt = [];
    let doAt = [];

    let opCode = {};
    
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
            return arg1 + '=' + arg2 + ';';
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
                return arg1 + '--;';
            else if (arg2 === 1)
                return arg1 + '++;';
            else if (isNumber(arg2) && arg2 < 0)
                return arg1 + '-=' + (-arg2) + ';';
            else
                return arg1 + '+=' + arg2 + ';';
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
                return arg1 + '--;';
            else if (arg2 === -1)
                return arg1 + '++;';
            else if (isNumber(arg2) && arg2 < 0)
                return arg1 + '+=' + (-arg2) + ';';
            else
                return arg1 + '-=' + arg2 + ';';
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
            return arg1 + '*=' + arg2 + ';';
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
            return arg1 + '%=' + arg2 + ';';
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
                {
                    let gto = $goto(pos, arg2);
                    if (gto === '}')
                        return '} while(true);'
                    return gto;
                }
                else
                    return '';
            }
            else
            {
                let gto = $goto(pos, arg2);
                if (gto === '{')
                    return 'if (' + arg1 + ' === 0) {';
                else if (gto === '}')
                    return '} while (' + arg1 + ' !== 0);';
                else
                    return 'if (' + arg1 + ' !== 0) {' + gto + '}';
            }
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
                let gto = $goto(pos, arg2);
                if (gto === '}')
                    return '} while(true);'
                return gto;
        }
            else
            {
                let gto = $goto(pos, arg2);
                if (gto === '{')
                    return 'if (' + arg1 + ' <= 0) {';
                else if (gto === '}')
                    return '} while (' + arg1 + ' > 0);';
                else
                    return 'if (' + arg1 + ' > 0) {' + gto + '}';
            }
        }
    );

    // internal instruction for optimization / compilation
    opCode.nop = vm.add(
        'nop',
        (arg1, arg2) => {},
        (instruction, parser) => {},
        (arg1, arg2) => { return ''; } // does nothing
    );

    opCode.jz = vm.add(
        'jz',
        (arg1, arg2) => {
            if (convert(arg1) == 0)
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
                let gto = $goto(pos, arg2);
                if (gto === '}')
                    return '} while(true);'
                return gto;
        }
            else
            {
                let gto = $goto(pos, arg2);
                if (gto === '{')
                    return 'if (' + arg1 + ' !== 0) {';
                else if (gto === '}')
                    return '} while (' + arg1 + ' === 0);';
                else
                    return 'if (' + arg1 + ' === 0) {' + gto + '}';
            }
        }
    );
    
    function $goto(pos, arg2)
    {
        if (typeof(arg2) === "string")
            throw "arg2 cannot be a register";

        let label = pos + arg2;
        if (label >= vm.$instructions.length)
        {
            return 'return;';
        }
        else if (label > pos)
        {
            closeBracketAt[label] = 1;
            return '{';
        }
        else
        {
            doAt[label] = 1;
            return '}';  
        }
    }

    vm.didReceive = function(value) {
        // does nothing by default
    }

    vm.didSend = function(value) {
        // does nothing by default        
    }
    
    vm.opCodes = opCode;

    vm.optimize = function(pass)
    {
        function check(p, code, arg1, arg2)
        {
            if (p >= vm.$instructions.length)
                return false;
            let i = vm.$instructions[p];
            if (i.code !== code)
                return false;
            if (arg1 !== undefined && i.arg1 !== arg1)
                return false;
            if (arg2 !== undefined && i.arg2 != arg2)
                return false;
            return true;
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
            let p = c;

            let i1 = vm.$instructions[c];

            // convert sub -value to add +value and vice versa

            if (i1.code === vm.opCodes.add && isNumber(i1.arg2) && i1.arg2 < 0)
            {
                i1.arg2 = -i1.arg2;
                convertTo(i1, 'sub');
            }
            else if (i1.code === vm.opCodes.sub && isNumber(i1.arg2) && i1.arg2 < 0)
            {
                i1.arg2 = -i1.arg2;
                convertTo(i1, 'add');
            }

            // convert jnz x 2 + jnz 1 n => nop + jz x n


            if (check(p++, vm.opCodes.jnz, undefined, 2))
            if (check(p++, vm.opCodes.jnz))
            {
                let i2 = vm.$instructions[c+1];
                if (! isNumber(i1.arg1) && isNumber(i2.arg1) && i2.arg1 !== 0)
                {
                    i2.arg1 = i1.arg1;
                    convertTo(i2, 'jz');
                    convertTo(i1, 'nop');
                    c++;
                }
            }

            if (pass === 2)
            {
                // Convert a set of instructions to a single modulo and if it's 0, set f to 0

                p = c;

                if (check(p++, vm.opCodes.set, 'e', 2))
                if (check(p++, vm.opCodes.set, 'g', 'd'))
                if (check(p++, vm.opCodes.mul, 'g', 'e'))
                if (check(p++, vm.opCodes.sub, 'g', 'b'))
                if (check(p++, vm.opCodes.jnz, 'g', 2))
                if (check(p++, vm.opCodes.set, 'f', 0))
                if (check(p++, vm.opCodes.add, 'e', 1)) // !!!!! was converted to 'add' by optimize(1);
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
                    c--; // back track 1
                }           
            } 
        }
    }
    
    vm.compileToJavascript = function(name, registerToReturn)
    {
        let instructions;
        let mul;
        let code        = [];

        function add(line)       { code.push(line); }
        function generatedCode() { return code.join(''); }

        function getInstructions()
        {
            // Just in case we call it multiple times
            mul    = [];
            instructions = [];
            closeBracketAt = [];
            doAt = [];

            for(let p = 0; p < vm.$instructions.length; p++)
            {
                let i = vm.$instructions[p];
                let js = i.asJS(i.arg1, i.arg2, p);
    
                if (registerToReturn !== undefined)
                    js = js.replace('return;', 'return ' + registerToReturn + ';');

                instructions.push(js);
    
                if (registerToReturn === 'm' && i.code == vm.opCodes.mul)
                    mul.push(1);
                else
                    mul.push(0);
            }
        }

        function makeRegisters()
        {
            let line  = '';
            let first = true;
            Object.keys(vm.$registers).forEach(k => 
            {
                if (first)
                {
                    first = false;
                    line += 'let ';
                }
                else
                    line += ', ';
    
                line += k + '=' + vm.$registers[k];
            });     
            return line + ';';       
        }

        // Optimize to convert jnz + jnz into jz

        vm.optimize(1); // pass 1
        //vm.print();

        // function header
        add('function ' + name + '() {');
        add(makeRegisters());

        // to emulate gotos

        getInstructions();

        // Generate instructions
        
        for(let p = 0; p < instructions.length; p++)
        {            
            if (closeBracketAt[p] === 1)
            {
                closeBracketAt[p] = 0;
                add('}');
            }
            if (doAt[p] === 1)
            {
                doAt[p] = 0;
                add('do {');
            }

            let js = instructions[p];

            if (js === undefined || js === '')
                continue;

            add(js);

            if (mul[p])
                add('m++;/* counting mul usage */');                    
        };

        // return value
        if (registerToReturn !== undefined) 
            add('return '+registerToReturn+';');
        else
            add('return;');

        // finish function
        add('}');

        return generatedCode();
    }
    
    vm.print = function()
    {
        for(let p = 0; p < vm.$instructions.length; p++)
        {
            let i = vm.$instructions[p];
            console.log(vm.getOpcodeName(i.code) + ' ' + i.arg1 + ' ' + i.arg2);
        }
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