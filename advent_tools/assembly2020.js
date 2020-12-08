const readFile = require('advent_tools/readfile');

function parseInstruction(line)
{
    const values = line.trim().split(' ');
    const token  = values[0].toLowerCase();
    const value  = +(values[values.length-1]);
    let fct;

    switch(token) {
        case 'nop':
            fct = _ => 1;
            break;

        case 'acc':
            fct = vm => { vm.accumulator += value; return 1; }
            break;

        case 'jmp':
            fct = _ => value;
            break;
    }

    return {
        token,
        value,
        execute: fct,
    };
}

class VirtualMachine
{
    constructor(filename)
    {
        this.instructions = [];
        this.accumulator  = 0;
        this.ip           = 0;

        if (filename)
        {
            for(const line of readFile(filename))
            {
                this.instructions.push(parseInstruction(line));
            }
        }
    }

    reset() 
    {
        this.accumulator = 0;
        this.ip          = 0;
    }
    
    step() 
    {
        if (this.ip < 0 || this.ip >= this.instructions.length)
        {
            throw "Invalid instruction pointer";
        }

        this.ip += this.instructions[this.ip].execute(this);
    }

    execute() 
    {
        while (this.ip >= 0 && this.ip < this.instructions.length)
        {
            this.step();
        }
    }
}

module.exports = VirtualMachine;