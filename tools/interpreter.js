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
        opcode[code] = nextOpCode++;
        opcodeFunctions[code] = fct;
        argumentParser[code] = parseArguments;
    }

    this.parse = async function(filename)
    {
        self.reset();

        var promise = new Promise(function (resolve,reject) 
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
        function doMultiplication(cpy)
        {
            if (self.$current+5 >= self.$instructions.length)
                return false;
    
            var jnz1 = self.$instructions[self.$current+3];
    
            if (jnz1.code !== opcode.jnz || jnz1.arg2 !== -2)
                return false;
            
            var jnz2 = self.$instructions[self.$current+5];
    
            if (jnz2.code !== opcode.jnz || jnz2.arg2 !== -5)
                return false;
    
            var dec2 = self.$instructions[self.$current+4];
    
            if (dec2.code !== opcode.dec)
                return false;
    
            var inc  = self.$instructions[self.$current+1];
            var dec1 = self.$instructions[self.$current+2];
    
            if (dec1.code === opcode.inc && inc.code === opcode.dec)
            {
                var i = dec1;
                dec1 = inc;
                inc  = i;
            }
    
            if (inc.code !== opcode.inc || dec1.code !== opcode.dec ||
                dec1.arg1 === dec2.arg2 ||
                dec1.arg1 !== jnz1.arg1 || dec2.arg1 !== jnz2.arg1 ||
                cpy.arg2 !== jnz1.arg1 || cpy.arg2 === cpy.arg1 ||
                inc.arg1 === dec1.arg1 || inc.arg1 === dec2.arg)
                return false;
    
            var v1  = cpy.arg1;
            var v2  = self.$registers[dec2.arg1];
    
            if (typeof(v1) === "string")
                v1 = self.$registers[v1];
            
            self.$registers[inc.arg1] += (v1*v2);
            self.$registers[dec1.arg1] = 0;
            self.$registers[dec2.arg1] = 0;
    
            return true;
        }

        var start = process.hrtime();

        self.$current = 0;

        while (self.$current < self.$instructions.length)
        {
            var i = self.$instructions[self.$current];

            if (i.code == opcode.cpy)
            {
                if (doMultiplication(i)) {
                    self.$current += 6;
                    continue;
                }
            }

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