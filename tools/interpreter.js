module.exports = function()
{    
    const prettyHrtime = require('pretty-hrtime');
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    
    let self = this;

    let input            = [];

    self.$registers      = {};
    self.$instructions   = [];
    self.$current ;

    let nextOpCode = 1;
    let opcode = {};
    let opcodeFunctions = {};
    let argumentParser = {};

    this.reset = function()
    {        
        input                = [];
        self.$registers      = {};
        self.$instructions   = [];
        self.$current        = undefined;
    }

    this.createArgument = function(value)
    {
        let v;

        if (typeof value == 'string')        
            return value;
        else if (value === undefined)
            throw "Invalid value"
        else
            return +value;                
    }

    this.getOpcode = function(code)
    {
        return opcode[code];
    }
    
    this.getInstruction = function(code)
    {
        return {
            code: opcode[code],
            fn:   opcodeFunctions[code]
        };
    }

    this.add = function(code, fct, parseArguments)
    {
        let opCode = nextOpCode++;
        opcode[code] = opCode;
        opcodeFunctions[code] = fct;
        argumentParser[code] = parseArguments;

        return opCode;
    }

    this.parse = async function(filename)
    {
        self.reset();

        let promise = new Promise(function (resolve,reject) 
        { 
            try
            {
                const readInput = readline.createInterface({
                    input: fs.createReadStream(filename)
                });
            
                readInput
                    .on('line', (line) => { 
                        input.push(line);
                    })
                    .on('close', () => {
                        resolve();
                    });
            }
            catch(error)
            {
                reject(error);
            }
        });

        await promise;
    } 

    this.compile = function()
    {
        let start = process.hrtime();
                        
        self.$registers      = {};
        self.$instructions   = [];
        self.$current        = undefined;

        for(let current = 0; current < input.length; current++)
        {
            let line  = input[current];
            let parse = new parser(line);
            let instruction = {
                code: 0,
                fn: undefined,
                arg1: undefined,
                arg2: undefined
            };

            let command = parse.getToken();

            instruction.code = opcode[command];
            if (instruction.code === undefined)
                throw "Invalid " + line;

            instruction.fn = opcodeFunctions[command];
            argumentParser[command](instruction, parse);
            
            // Pre-define registers
            if (instruction.arg1 !== undefined && typeof(instruction.arg1) === "string")
               self. $registers[instruction.arg1.value] = 0;
            if (instruction.arg2 !== undefined && typeof(instruction.arg1) === "string")
                self.$registers[instruction.arg2.value] = 0;

            self.$instructions.push(instruction);
        }

        let end = process.hrtime(start);
        let words = prettyHrtime(end, {verbose:true});

        console.log("Compiled in " + words);
    }

    this.doMultiplication = function() { return 0; }

    this.execute = function()
    {
        let start = process.hrtime();

        self.$current = 0;

        while (self.$current < self.$instructions.length)
        {
            let i = self.$instructions[self.$current];

            let offset = self.doMultiplication(i);
            if (offset > 0) {
                self.$current += offset;
                continue;
            }

            offset = i.fn(i.arg1, i.arg2);
            if (offset === undefined)
                self.$current++;
            else
                self.$current += offset;
        }

        let end = process.hrtime(start);
        let words = prettyHrtime(end, {verbose:true});

        console.log("Executed in " +words);
    }
}