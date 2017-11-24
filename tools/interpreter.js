module.exports = function()
{    
    const prettyHrtime = require('pretty-hrtime');
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    
    var self = this;

    var input            = [];

    self.$registers      = {};
    self.$instructions   = [];
    self.$current ;

    var nextOpCode = 1;
    var opcode = {};
    var opcodeFunctions = {};
    var argumentParser = {};

    this.reset = function()
    {        
        input                = [];
        self.$registers      = {};
        self.$instructions   = [];
        self.$current        = undefined;
    }

    this.createArgument = function(value)
    {
        var v;

        if (typeof value == 'string')        
            return value;
        else if (value === undefined)
            throw "Invalid value"
        else
            return +value;                
    }

    this.add = function(code, fct, parseArguments)
    {
        opcode[code] = nextOpCode++;
        opcodeFunctions[code] = fct;
        argumentParser[code] = parseArguments;
    }

    this.parse = async function(filename)
    {
        var done;

        this.reset();

        var promise = new Promise(function (resolve) { 
            done = resolve;
         });

        const readInput = readline.createInterface({
            input: fs.createReadStream(filename)
        });
    
        readInput
        .on('line', (line) => { 
            input.push(line);
        })
        .on('close', () => {
           done();
        });

        await promise;
    } 

    this.compile = function()
    {
        var start = process.hrtime();
                        
        self.$registers      = {};
        self.$instructions   = [];
        self.$current        = undefined;

        for(var current = 0; current < input.length; current++)
        {
            var line  = input[current];
            var parse = new parser(line);
            var instruction = {
                code: 0,
                fn: undefined,
                arg1: undefined,
                arg2: undefined
            };

            var command = parse.getToken();

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

        var end = process.hrtime(start);
        var words = prettyHrtime(end, {verbose:true});

        console.log("Compiled in " + words);
    }

    this.execute = function()
    {
        var start = process.hrtime();

        self.$current = 0;

        while (self.$current < self.$instructions.length)
        {
            var i = self.$instructions[self.$current];

            var offset = i.fn(i.arg1, i.arg2);
            if (offset === undefined)
                self.$current++;
            else
                self.$current += offset;
        }

        var end = process.hrtime(start);
        var words = prettyHrtime(end, {verbose:true});

        console.log("Executed in " +words);
    }
}