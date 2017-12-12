module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day12.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    function dumpResult()
    {
        let destin = { '0':1 };

        let program = getProgram(0);
        
        addDestinations(destin, program);

        console.log('Part 1: ' + Object.keys(destin).length + " program connected to 0");

        let groupCount = 1;
        Object.keys(programs).forEach( p => {
            if (processed[p] === undefined)
            {
                destin = {}; destin[p] = 1;
                processed[p] = 1;
                groupCount++;
                addDestinations(destin, getProgram(p));
            }
        });

        console.log('Part 2: ' + groupCount + " groups of programs");
    }

    let programs  = {};
    let processed = {};

    function addDestinations(destin, program)
    {
        Object.keys(program).forEach( d => {
            if (destin[d] === undefined)
            {
                destin[d] = 1;
                var p = getProgram(d);
                addDestinations(destin, p);
            }
            if (processed[d] === undefined)
                processed[d] = 1;
        })
    }

    function getProgram(number)
    {
        let program = programs[number];
        if (program === undefined)
        {
            program = { };
            programs[number] = program;
        }
        return program;
    }

    function processLine(line)
    {
        let parse = new parser(line);
        let program = getProgram(parse.getNumber(true));

        parse.expectOperator('<');
        parse.expectOperator('-');
        parse.expectOperator('>');
        let destin = parse.getNumber(true);
        program[destin] = 1;
        while(! parse.endOfLine())
        {            
            parse.expectOperator(',');
            destin = parse.getNumber(true);
            program[destin] = 1;
        }
    }
}