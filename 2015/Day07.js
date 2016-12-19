module.exports = function() 
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require("../parser.js");

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day07.data')
    });

    var wires;

    var wires1 = {
    };
    var wires2 = {
    }

    readInput
    .on('line', (line) => {
        wires = wires1; 
        executeInstruction(line);
        wires = wires2; 
        executeInstruction(line);
    })
    .on('close', () => {
        wires = wires1;
        evaluate();
        var a = wires.a.value;
        console.log("Value of wire a is: " + a);

        wires = wires2;
        getWire('b').value = a;

        evaluate();
        var a = wires.a.value;
        console.log("Value of wire a is: " + a);

        process.exit(0);
    });    

    function getNumber(str)
    {
        var value = 0;
        for(var i = 0; i < str.length; i++)
        {
            var c = str[i];
            if (c >= '0' && c <= '9')
                value = (value*10) + (+c);
            else
                return undefined;
        }
        return value;
    }

    function getWire(name)
    {
        var wire = wires[name];
        if (wire === undefined) {
            wire = wires[name] = {
                id:name,
                value:undefined,
                operation: '',
                inputs: []
            }
        }
        return wire;
    }

    function evaluate()
    {
        updated = true;
        while (updated)
        {
            updated = false;
            var keys = Object.keys(wires); 
            keys.forEach(function(key) 
            {
                var wire = wires[key];

                if (wire.value === undefined)                    
                {
                    var inputs = [];
                    for(var i = 0; i < wire.inputs.length; i++)
                    {
                        var x = wire.inputs[i];
                        if (typeof x == 'string') 
                        {
                            var w = getWire(x);
                            if (w.value !== undefined)
                                inputs.push(w.value);
                        }
                        else
                            inputs.push(wire.inputs[i]);
                    }
                    if (wire.inputs.length == inputs.length && inputs.length > 0) 
                    {
                        updated = true;
                        switch (wire.operation) 
                        {
                            case "NOT":
                                wire.value = (~inputs[0]) & 0xFFFF;
                                break;
                            case "SET":
                                wire.value = inputs[0];
                                break;
                            case "AND":
                                wire.value = inputs[0] & inputs[1];
                                break;
                            case "OR":
                                wire.value = inputs[0] | inputs[1];
                                break;
                            case "RSHIFT":
                                wire.value = (inputs[0] >> inputs[1]) & 0xFFFF;
                                break;
                            case "LSHIFT":
                                wire.value = (inputs[0] << inputs[1]) & 0xFFFF;
                                break;
                            default:
                                throw "Invalid operation " + wire.operation; 
                        }
                    }
                }
            });
        }
    }

    function executeInstruction(line)
    {
        var ls      = line.split('->');
        var wire    = ls[1].trim();
        var command = ls[0].trim();

        if (wires[wire] !== undefined)
            throw "Wasn't expecting this";

        wire = getWire(wire);
        var ops = command.split(' ');
        if (ops.length == 3) 
        {
            var v1 = getNumber(ops[0]);
            var v2 = getNumber(ops[2]);
            if (v1 === undefined)
                v1 = ops[0];
            if (v2 === undefined)
                v2 = ops[2];
            wire.operation = ops[1];
            wire.inputs.push(v1);
            wire.inputs.push(v2);
        }
        else if (ops.length == 2)
        {
            if (ops[0] != 'NOT')
                throw "Was expecting NOT";
            wire.operation = 'NOT';
            var n = getNumber(ops[1]);
            if (n === undefined)
                wire.inputs.push(ops[1]);
            else
                wire.inputs.push(n);
        }
        else if (ops.length == 1)
        {
            var v = getNumber(ops[0]);
            if (v === undefined)
            {
                wire.operation = "SET";
                wire.inputs.push(ops[0]);
            }
            else
                wire.value = v ;
        }
        else
            throw "Invalid syntax";
    }
}