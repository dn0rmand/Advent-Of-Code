module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const prettyHrtime = require('pretty-hrtime');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day15.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    const generators = {
        A: {
            start: 0,
            value: 0,
            factor: 16807,
            mask: 3
        },
        B: {
            start: 0,
            value: 0,
            factor: 48271,
            mask: 7
        }
    };

    const divider = 2147483647; // 0x7fffffff

    function dumpResult()
    {
        generators.A.next = generators.B.next = function() 
        {
            this.value = (this.value * this.factor) % divider;
        };

        generators.A.value = generators.A.start;
        generators.B.value = generators.B.start;

        let start = process.hrtime();
        let matches = solve(40000000);
        let end = process.hrtime(start);
        let words = prettyHrtime(end, { verbose:true });
    
        console.log('Part 1: ' + matches + ' matches (612) : ' + words);

        generators.A.calculate = generators.B.calculate = generators.A.next;

        generators.A.next = generators.B.next = function() 
        {
            do 
            {
                this.calculate();
            }
            while ((this.value & this.mask) != 0);
        };

        generators.A.value = generators.A.start;
        generators.B.value = generators.B.start;

        start = process.hrtime();
        matches = solve(5000000);
        end = process.hrtime(start);
        words = prettyHrtime(end, { verbose:true });

        console.log('Part 2: ' + matches + ' matches (285) : ' + words);
    }

    function processLine(line)
    {
        let parse = new parser(line);

        parse.expectToken('Generator');
        let generator = parse.getToken();
        parse.expectToken('starts');
        parse.expectToken('with');
        let value = parse.getNumber();
        parse.expectDone();

        generators[generator].start = value;
    }

    function isMatch(v1, v2)
    {
        return (v1 & 0xFFFF) === (v2 & 0xFFFF);
    }

    function solve(count)
    {
        let matches = 0;
        while (count-- > 0)
        {
            generators.A.next();
            generators.B.next();
            if ((generators.A.value & 0xFFFF) === (generators.B.value & 0xFFFF))            
                matches++;
        }
        return matches;
    }
}