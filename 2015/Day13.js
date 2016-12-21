module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const parser    = require('../parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day13.data')
    });

    readInput
    .on('line', (line) => { 
        parseInput(line.toLowerCase());
    })
    .on('close', () => {
        calculate();
        people['DN'] = 0;
        console.log("With myself:");
        calculate();
        process.exit(0);
    });

    var happiness = {

    };
    var people = {

    };

    function parseInput(line)
    {
        var parse = new parser(line);

        var name1 = parse.getToken();
        parse.expectToken('would');
        var command = parse.getToken();
        var happy = parse.getNumber();

        parse.expectToken('happiness');
        parse.expectToken('units');
        parse.expectToken('by');
        parse.expectToken('sitting');
        parse.expectToken('next');
        parse.expectToken('to');
        var name2 = parse.getToken();
        parse.expectOperator('.');

        people[name1] = 0;
        people[name2] = 0;

        if (command == "lose")
            happy = -happy;
        else if (command == "gain")
            happy = +happy;
        else
            throw "invalid command";

        var key1 = name1+'_'+name2;
        var key2 = name1+'_'+name2;

        assert(happiness[key1] === undefined);

        happiness[key1] = happy;
    }

    function calculateTableHappiness(table)
    {
        var $happiness = 0;
        var k = table.toString();
        for(var i = 0 ; i < table.length-1 ; i++)
        {
            var name1 = table[i];
            if (name1 == "DN")
                continue; // 0 happiness

            var name2 = table[(i+1) % table.length];
            var name3 = i == 0 ? table[table.length-1] : table[i-1];

            var k2 = name1 + "_" + name3;

            if (name2 != "DN")
            {
                var k1 = name1 + "_" + name2;
                assert(happiness[k1] !== undefined);
                var h1 = happiness[k1];
                $happiness += h1;
            }
            else
            {
                assert(true);
            }
            if (name3 != "DN")
            {
                assert(happiness[k2] !== undefined);
                var h2 = happiness[k2];
                $happiness += h2 ;
            }
            else
            {
                assert(true);
            }
        }
        return $happiness;
    }

    function calculate()
    {
        var names = Object.keys(people);
        var minHappiness = undefined;
        var maxHappiness = undefined;

        for(var i = 0; i < names.length; i++)
        {
            var start = names[i];
            persons = {}; // Clear
            makeTable(start, {}, []);
        }

        console.log("Min happiness: " + minHappiness);
        console.log("Max happiness: " + maxHappiness);

        function makeTable(name, persons, table)
        {
            persons[name] = 1;
            table.push(name);
            if (table.length == names.length) // All sitting
            {
                var happiness = calculateTableHappiness(table);

                if (maxHappiness == undefined)
                    maxHappiness = happiness;
                else
                    maxHappiness = Math.max(maxHappiness, happiness);

                if (minHappiness == undefined)
                    minHappiness = happiness;
                else
                    minHappiness = Math.min(minHappiness, happiness);
            }
            else
            {
                for(var i = 0 ; i < names.length ; i++ )
                {
                    var name2 = names[i];
                    if (persons[name2] === undefined)
                    {
                        makeTable(name2, persons, table);
                    }
                }
            }
            table.pop();
            persons[name] = undefined;
        }
    }
}