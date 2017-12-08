module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day08.data')
    });

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        instructions.forEach( instruction => { instruction(); } );
        
        var max = Math.max(... Object.values(registers) );

        console.log('PART 1 -> Max value is ' + max + ' (4888)');
        console.log('PART 2 -> Max value at any point of time is ' + maxValueEver + ' (7774)');

        process.exit(0);
    });

    const opcodes = 
    {
        inc: (v1, v2) => v1+v2,
        dec: (v1, v2) => v1-v2
    }

    const operators = 
    {
        '!=': (v1, v2) => v1 != v2,
        '==': (v1, v2) => v1 == v2,
        '<=': (v1, v2) => v1 <= v2,
        '>=': (v1, v2) => v1 >= v2,
        '<':  (v1, v2) => v1 < v2,
        '>':  (v1, v2) => v1 > v2

    }
    const registers = {};
    const instructions = [];

    let maxValueEver = 0; // starting point of all registers    
    
    function getRegister(name)
    {
        let value = registers[name];
        if (value === undefined)
        {
            registers[name] = 0;
            return 0;
        }
        return value;
    }

    function setRegister(name, value)
    {
        registers[name] = value;
        if (value > maxValueEver)
            maxValueEver = value;
    }
    
    ///
    /// I could have execute while parsing but I was expecting part 2 
    /// to have different default values for the registers
    ///
    function processLine(line)
    {
        let parse = new parser(line);

        let ir  = parse.getToken();
        let fct = opcodes[parse.getToken()];        
        let iv  = parse.getSignedNumber();

        parse.expectToken("if");
        
        let cr  = parse.getToken();
        let cop = operators[parse.getOperator()];
        let cv  = parse.getSignedNumber();
                
        parse.expectDone();        

        let condition = () => cop(getRegister(cr), cv);

        let instruction = () => condition() ? setRegister(ir, fct(getRegister(ir), iv)) : undefined;

        instructions.push(instruction);
    }
}
