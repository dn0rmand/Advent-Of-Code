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
    let asJS = {};

    this.getCurrentLine = function() { return input[self.$current]; }

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
            fn:   opcodeFunctions[code],
            asJS: asJS[code],
        };
    }

    this.add = function(code, fct, parseArguments, js)
    {
        let opCode = nextOpCode++;
        opcode[code] = opCode;
        opcodeFunctions[code] = fct;
        argumentParser[code] = parseArguments;
        asJS[code] = js;
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
                        var l = line.split('//')[0];
                        if (l.trim().length !== 0)
                            input.push(l);
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

    this.compile = function(trace)
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
                asJS: undefined,
                arg1: undefined,
                arg2: undefined
            };

            let command = parse.getToken();

            instruction.code = opcode[command];
            if (instruction.code === undefined)
                throw "Invalid " + line;

            instruction.fn = opcodeFunctions[command];
            instruction.asJS = asJS[command];
            argumentParser[command](instruction, parse);

            // Pre-define registers
            if (instruction.arg1 !== undefined && typeof(instruction.arg1) === "string")
               self.$registers[instruction.arg1] = 0;
            if (instruction.arg2 !== undefined && typeof(instruction.arg2) === "string")
                self.$registers[instruction.arg2] = 0;

            self.$instructions.push(instruction);
        }

        let end = process.hrtime(start);

        if (trace === true)
            console.log("Compiled in " + prettyHrtime(end, {verbose:true}));
    }

    this.optimize = function() { }

    this.runStep = function()
    {
        if (self.$current === undefined)
            self.$current = 0;

        if (self.$current < self.$instructions.length)
        {
            let i = self.$instructions[self.$current];

            let offset = self.optimize(i);
            if (offset !== undefined && offset !== 0) 
            {
                self.$current += offset;
                return;
            }

            offset = i.fn(i.arg1, i.arg2);
            if (offset === undefined)
                self.$current++;
            else
                self.$current += offset;
        }
    }

    this.execute = function(trace)
    {
        let start = process.hrtime();

        self.$current = 0;

        while (self.$current < self.$instructions.length)
        {
            self.runStep();
        }

        let end = process.hrtime(start);

        if (trace === true)
            console.log("Executed in " +  prettyHrtime(end, {verbose:true}));
    }
}